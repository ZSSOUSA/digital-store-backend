const sequelize = require('../../../src/config/database');

const {
  Product,
  Category,
  ProductImage,
  ProductOption,
} = require('../../../src/models');

const SequelizeProductRepository = require(
  '../../../src/infrastructure/repositories/SequelizeProductRepository'
);

describe('SequelizeProductRepository - Integração MySQL', () => {
  let repository;

  beforeAll(async () => {
    // Protege o banco de desenvolvimento contra operações destrutivas.
    if (sequelize.config.database !== 'digital_store_test') {
      throw new Error(
        'Operação bloqueada: banco diferente de digital_store_test'
      );
    }

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    repository = new SequelizeProductRepository();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Testa a gravação real do produto e de todos os seus relacionamentos.
  test('deve criar produto com categoria, imagens e opções no MySQL', async () => {
    const categoria = await Category.create({
      name: 'Eletrônicos',
      slug: 'eletronicos',
      use_in_menu: true,
    });

    const produto = {
      enabled: true,
      name: 'Notebook de Teste',
      slug: 'notebook-de-teste',
      stock: 10,
      description: 'Produto utilizado no teste de integração',
      price: 3500,
      price_with_discount: 3200,
    };

    const dadosRelacionados = {
      category_ids: [categoria.id],
      images: [
        {
          path: 'notebook-teste.png',
          enabled: true,
        },
      ],
      options: [
        {
          title: 'Cor',
          shape: 'square',
          radius: 0,
          type: 'text',
          values: 'Preto,Prata',
        },
      ],
    };

    const productId = await repository.create(
      produto,
      dadosRelacionados
    );

    const produtoSalvo = await Product.findByPk(productId, {
      include: [
        { model: Category, as: 'categories' },
        { model: ProductImage, as: 'images' },
        { model: ProductOption, as: 'options' },
      ],
    });

    expect(produtoSalvo).not.toBeNull();
    expect(produtoSalvo.name).toBe('Notebook de Teste');

    expect(produtoSalvo.categories).toHaveLength(1);
    expect(produtoSalvo.categories[0].id).toBe(categoria.id);

    expect(produtoSalvo.images).toHaveLength(1);
    expect(produtoSalvo.images[0].path).toBe('notebook-teste.png');

    expect(produtoSalvo.options).toHaveLength(1);
    expect(produtoSalvo.options[0].title).toBe('Cor');
    expect(produtoSalvo.options[0].values).toBe('Preto,Prata');
  });

  // Testa se a transação desfaz a criação do produto quando uma imagem é inválida.
  test('deve desfazer a criação do produto quando ocorrer erro ao salvar imagem', async () => {
    const quantidadeAntes = await Product.count();

    const produto = {
      enabled: true,
      name: 'Produto com Falha',
      slug: 'produto-com-falha',
      stock: 5,
      description: 'Teste de rollback',
      price: 100,
      price_with_discount: 90,
    };

    await expect(
      repository.create(produto, {
        images: [
          {
            path: '   ',
          },
        ],
      })
    ).rejects.toThrow('O caminho da imagem é obrigatório');

    const quantidadeDepois = await Product.count();

    expect(quantidadeDepois).toBe(quantidadeAntes);
  });
});
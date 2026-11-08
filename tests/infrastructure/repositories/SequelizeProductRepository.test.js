
const sequelize = require('../../../src/config/database');

const {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
} = require('../../../src/models');

const SequelizeProductRepository = require('../../../src/infrastructure/repositories/SequelizeProductRepository');

// Simula o banco de dados e sua transação.
jest.mock('../../../src/config/database', () => ({
  transaction: jest.fn(),
}));

// Simula os modelos do Sequelize.
jest.mock('../../../src/models', () => ({
  Product: {
    create: jest.fn(),
  },
  ProductCategory: {
    bulkCreate: jest.fn(),
  },
  ProductImage: {
    bulkCreate: jest.fn(),
  },
  ProductOption: {
    bulkCreate: jest.fn(),
  },
}));

describe('SequelizeProductRepository', () => {
  let repository;
  let transaction;

  const produtoValido = {
    enabled: true,
    name: 'Notebook Dell',
    slug: 'notebook-dell',
    stock: 10,
    description: 'Notebook para trabalho',
    price: 3500,
    price_with_discount: 3200,
  };

  const dadosRelacionados = {
    category_ids: [1, 2],
    images: [
      { path: '/images/notebook.png' },
    ],
    options: [
      {
        title: 'Cor',
        shape: 'square',
        radius: 0,
        type: 'color',
        values: ['Preto', 'Prata'],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new SequelizeProductRepository();

    transaction = {};

    // Simula a execução de uma transação Sequelize.
    sequelize.transaction.mockImplementation(async (callback) => {
      return callback(transaction);
    });

    Product.create.mockResolvedValue({ id: 123 });
    ProductCategory.bulkCreate.mockResolvedValue([]);
    ProductImage.bulkCreate.mockResolvedValue([]);
    ProductOption.bulkCreate.mockResolvedValue([]);
  });

  test('deve criar um produto e retornar seu identificador', async () => {
    const id = await repository.create(produtoValido);

    expect(id).toBe(123);

    expect(Product.create).toHaveBeenCalledWith(
      produtoValido,
      { transaction }
    );
  });

  test('deve salvar categorias, imagens e opções do produto', async () => {
    await repository.create(produtoValido, dadosRelacionados);

    expect(ProductCategory.bulkCreate).toHaveBeenCalledWith(
      [
        { product_id: 123, category_id: 1 },
        { product_id: 123, category_id: 2 },
      ],
      { transaction }
    );

    expect(ProductImage.bulkCreate).toHaveBeenCalledWith(
      [
        {
          product_id: 123,
          enabled: true,
          path: '/images/notebook.png',
        },
      ],
      { transaction }
    );

    expect(ProductOption.bulkCreate).toHaveBeenCalledWith(
      [
        {
          product_id: 123,
          title: 'Cor',
          shape: 'square',
          radius: 0,
          type: 'color',
          values: 'Preto,Prata',
        },
      ],
      { transaction }
    );
  });

  test('deve executar todas as gravações dentro da mesma transação', async () => {
    await repository.create(produtoValido, dadosRelacionados);

    expect(sequelize.transaction).toHaveBeenCalledTimes(1);

    expect(Product.create.mock.calls[0][1].transaction)
      .toBe(transaction);

    expect(ProductCategory.bulkCreate.mock.calls[0][1].transaction)
      .toBe(transaction);

    expect(ProductImage.bulkCreate.mock.calls[0][1].transaction)
      .toBe(transaction);

    expect(ProductOption.bulkCreate.mock.calls[0][1].transaction)
      .toBe(transaction);
  });

  test('não deve tentar salvar relacionamentos quando não forem informados', async () => {
    await repository.create(produtoValido);

    expect(Product.create).toHaveBeenCalledTimes(1);
    expect(ProductCategory.bulkCreate).not.toHaveBeenCalled();
    expect(ProductImage.bulkCreate).not.toHaveBeenCalled();
    expect(ProductOption.bulkCreate).not.toHaveBeenCalled();
  });

  test('deve rejeitar categorias que não sejam uma lista', async () => {
    await expect(
      repository.create(produtoValido, {
        category_ids: 'inválido',
      })
    ).rejects.toThrow('As categorias devem ser informadas em uma lista');

    expect(sequelize.transaction).not.toHaveBeenCalled();
  });

  test('deve rejeitar imagens sem caminho válido', async () => {
    await expect(
      repository.create(produtoValido, {
        images: [{ path: '' }],
      })
    ).rejects.toThrow('O caminho da imagem é obrigatório');
  });

  test('deve propagar erros ocorridos durante a gravação', async () => {
    ProductImage.bulkCreate.mockRejectedValue(
      new Error('Erro ao salvar imagem')
    );

    await expect(
      repository.create(produtoValido, dadosRelacionados)
    ).rejects.toThrow('Erro ao salvar imagem');

    expect(sequelize.transaction).toHaveBeenCalledTimes(1);
  });
});

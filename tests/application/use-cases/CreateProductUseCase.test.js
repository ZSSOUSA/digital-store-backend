
const Product = require('../../../src/domain/entities/Product');
const CreateProductUseCase = require('../../../src/application/use-cases/CreateProductUseCase');

describe('CreateProductUseCase', () => {
  // Dados válidos utilizados como base nos testes.
  const produtoValido = {
    enabled: true,
    name: 'Notebook Dell',
    slug: 'notebook-dell',
    stock: 10,
    description: 'Notebook para trabalho',
    price: 3500,
    price_with_discount: 3200,
    category_ids: [1, 2],
    images: [{ path: '/images/notebook.png' }],
    options: [],
  };

  // Cria um repositório simulado para não depender do banco de dados.
  const criarRepositorioMock = () => ({
    create: jest.fn().mockResolvedValue(123),
  });

  // Deve rejeitar a criação quando não receber um repositório.
  test('deve exigir um repositório de produtos', () => {
    expect(() => new CreateProductUseCase(null))
      .toThrow('O repositório de produtos é obrigatório');
  });

  // Deve rejeitar dados ausentes ou inválidos.
  test('não deve aceitar dados ausentes', async () => {
    const repository = criarRepositorioMock();
    const useCase = new CreateProductUseCase(repository);

    await expect(useCase.execute(null))
      .rejects.toThrow('Os dados do produto são obrigatórios');

    expect(repository.create).not.toHaveBeenCalled();
  });

  // Deve criar uma entidade válida e enviar ao repositório.
  test('deve criar um produto e chamar o repositório', async () => {
    const repository = criarRepositorioMock();
    const useCase = new CreateProductUseCase(repository);

    const resultado = await useCase.execute(produtoValido);

    expect(resultado).toBe(123);
    expect(repository.create).toHaveBeenCalledTimes(1);

    const [produto, dadosRelacionados] =
      repository.create.mock.calls[0];

    expect(produto).toBeInstanceOf(Product);
    expect(produto.name).toBe('Notebook Dell');

    expect(dadosRelacionados).toEqual({
      category_ids: [1, 2],
      images: [{ path: '/images/notebook.png' }],
      options: [],
    });
  });

  // Não deve persistir quando a entidade reprovar os dados.
  test('não deve chamar o repositório quando o produto for inválido', async () => {
    const repository = criarRepositorioMock();
    const useCase = new CreateProductUseCase(repository);

    await expect(
      useCase.execute({
        ...produtoValido,
        price: -100,
      })
    ).rejects.toThrow('O preço deve ser um número válido não negativo');

    expect(repository.create).not.toHaveBeenCalled();
  });

  // Deve propagar erros ocorridos durante a persistência.
  test('deve propagar erros do repositório', async () => {
    const repository = {
      create: jest.fn().mockRejectedValue(
        new Error('Falha ao salvar produto')
      ),
    };

    const useCase = new CreateProductUseCase(repository);

    await expect(useCase.execute(produtoValido))
      .rejects.toThrow('Falha ao salvar produto');
  });
});

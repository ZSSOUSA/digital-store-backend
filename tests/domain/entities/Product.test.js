
const Product = require('../../../src/domain/entities/Product');

describe('Entidade Product', () => {
  // Dados de um produto válido usados como base nos testes.
  const produtoValido = {
    enabled: true,
    name: 'Notebook Dell',
    slug: 'notebook-dell',
    stock: 10,
    description: 'Notebook para trabalho',
    price: 3500,
    price_with_discount: 3200,
  };

  // Deve criar um produto quando todos os dados forem válidos.
  test('deve criar um produto válido', () => {
    const produto = new Product(produtoValido);

    expect(produto.name).toBe('Notebook Dell');
    expect(produto.slug).toBe('notebook-dell');
    expect(produto.price).toBe(3500);
    expect(produto.price_with_discount).toBe(3200);
  });

  // Deve aplicar os valores padrão quando não forem informados.
  test('deve aplicar os valores padrão', () => {
    const produto = new Product({
      name: 'Mouse',
      slug: 'mouse',
      price: 100,
      price_with_discount: 90,
    });

    expect(produto.enabled).toBe(false);
    expect(produto.stock).toBe(0);
    expect(produto.description).toBeNull();
  });

  // Não deve aceitar nome vazio ou composto apenas por espaços.
  test('não deve aceitar nome vazio', () => {
    expect(() => new Product({
      ...produtoValido,
      name: '   ',
    })).toThrow('O nome do produto é obrigatório');
  });

  // Não deve aceitar slug vazio.
  test('não deve aceitar slug vazio', () => {
    expect(() => new Product({
      ...produtoValido,
      slug: '',
    })).toThrow('O slug do produto é obrigatório');
  });

  // Não deve aceitar estoque negativo.
  test('não deve aceitar estoque negativo', () => {
    expect(() => new Product({
      ...produtoValido,
      stock: -1,
    })).toThrow('O estoque deve ser um número inteiro não negativo');
  });

  // Não deve aceitar estoque com casas decimais.
  test('não deve aceitar estoque decimal', () => {
    expect(() => new Product({
      ...produtoValido,
      stock: 2.5,
    })).toThrow('O estoque deve ser um número inteiro não negativo');
  });

  // Não deve aceitar preço negativo.
  test('não deve aceitar preço negativo', () => {
    expect(() => new Product({
      ...produtoValido,
      price: -10,
    })).toThrow('O preço deve ser um número válido não negativo');
  });

  // Não deve aceitar preço que não seja um número.
  test('não deve aceitar preço inválido', () => {
    expect(() => new Product({
      ...produtoValido,
      price: '3500',
    })).toThrow('O preço deve ser um número válido não negativo');
  });

  // Não deve aceitar desconto maior que o preço original.
  test('não deve aceitar desconto maior que o preço original', () => {
    expect(() => new Product({
      ...produtoValido,
      price_with_discount: 4000,
    })).toThrow('O preço com desconto não pode ser maior que o preço original');
  });

  // Não deve aceitar enabled com tipo diferente de boolean.
  test('não deve aceitar enabled inválido', () => {
    expect(() => new Product({
      ...produtoValido,
      enabled: 'true',
    })).toThrow('O campo enabled deve ser booleano');
  });

  // Não deve permitir alteração acidental dos dados da entidade.
  test('deve impedir alterações na entidade após sua criação', () => {
    const produto = new Product(produtoValido);

    expect(Object.isFrozen(produto)).toBe(true);
  });

  // Deve remover espaços extras no início e no final dos textos.
  test('deve remover espaços extras do nome e slug', () => {
    const produto = new Product({
      ...produtoValido,
      name: '  Notebook Dell  ',
      slug: '  notebook-dell  ',
    });

    expect(produto.name).toBe('Notebook Dell');
    expect(produto.slug).toBe('notebook-dell');
  });
});

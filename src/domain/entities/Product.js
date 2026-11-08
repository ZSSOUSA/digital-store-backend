
class Product {
  constructor({
    enabled = false,
    name,
    slug,
    stock = 0,
    description = null,
    price,
    price_with_discount,
  }) {
    this.validateName(name);
    this.validateSlug(slug);
    this.validateStock(stock);
    this.validatePrice(price);
    this.validateDiscount(price, price_with_discount);

    if (typeof enabled !== 'boolean') {
      throw new Error('O campo enabled deve ser booleano');
    }

    if (description !== null && typeof description !== 'string') {
      throw new Error('A descrição deve ser um texto ou nula');
    }

    this.enabled = enabled;
    this.name = name.trim();
    this.slug = slug.trim();
    this.stock = stock;
    this.description = description;
    this.price = price;
    this.price_with_discount = price_with_discount;

    Object.freeze(this);
  }

  validateName(name) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('O nome do produto é obrigatório');
    }
  }

  validateSlug(slug) {
    if (typeof slug !== 'string' || !slug.trim()) {
      throw new Error('O slug do produto é obrigatório');
    }
  }

  validateStock(stock) {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error('O estoque deve ser um número inteiro não negativo');
    }
  }

  validatePrice(price) {
    if (
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new Error('O preço deve ser um número válido não negativo');
    }
  }

  validateDiscount(price, priceWithDiscount) {
    if (
      typeof priceWithDiscount !== 'number' ||
      !Number.isFinite(priceWithDiscount) ||
      priceWithDiscount < 0
    ) {
      throw new Error('O preço com desconto deve ser um número válido não negativo');
    }

    if (priceWithDiscount > price) {
      throw new Error('O preço com desconto não pode ser maior que o preço original');
    }
  }
}

module.exports = Product;


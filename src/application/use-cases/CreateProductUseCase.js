
const Product = require('../../domain/entities/Product');

class CreateProductUseCase {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error('O repositório de produtos é obrigatório');
    }

    this.productRepository = productRepository;
  }

  async execute(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw new Error('Os dados do produto são obrigatórios');
    }

    // Cria a entidade e valida as regras de negócio.
    const product = new Product(input);

    // Separa os relacionamentos dos dados principais.
    const relatedData = {
      category_ids: input.category_ids || [],
      images: input.images || [],
      options: input.options || [],
    };

    // Solicita ao repositório a persistência do produto.
    return this.productRepository.create(product, relatedData);
  }
}

module.exports = CreateProductUseCase;

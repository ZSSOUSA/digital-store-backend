
const sequelize = require('../../config/database');

const {
  Product,
  ProductCategory,
  ProductImage,
  ProductOption,
} = require('../../models');

class SequelizeProductRepository {
  async create(product, relatedData = {}) {
    // Garante que os dados relacionados tenham os formatos esperados.
    const {
      category_ids = [],
      images = [],
      options = [],
    } = relatedData;

    if (!Array.isArray(category_ids)) {
      throw new Error('As categorias devem ser informadas em uma lista');
    }

    if (!Array.isArray(images)) {
      throw new Error('As imagens devem ser informadas em uma lista');
    }

    if (!Array.isArray(options)) {
      throw new Error('As opções devem ser informadas em uma lista');
    }

    // Uma única transação garante que todas as gravações
    // sejam concluídas ou desfeitas em caso de erro.
    return sequelize.transaction(async (transaction) => {
      // 1. Cria o produto principal.
      const produtoCriado = await Product.create(
        {
          enabled: product.enabled,
          name: product.name,
          slug: product.slug,
          stock: product.stock,
          description: product.description,
          price: product.price,
          price_with_discount: product.price_with_discount,
        },
        { transaction }
      );

      const productId = produtoCriado.id;

      // 2. Vincula as categorias ao produto.
      if (category_ids.length > 0) {
        const categorias = category_ids.map((categoryId) => ({
          product_id: productId,
          category_id: categoryId,
        }));

        await ProductCategory.bulkCreate(categorias, {
          transaction,
        });
      }

      // 3. Salva as imagens do produto.
      if (images.length > 0) {
        const imagens = images.map((image) => {
          const path = image.path || image.content;

          if (typeof path !== 'string' || !path.trim()) {
            throw new Error('O caminho da imagem é obrigatório');
          }

          return {
            product_id: productId,
            enabled: image.enabled !== false,
            path: path.trim(),
          };
        });

        await ProductImage.bulkCreate(imagens, {
          transaction,
        });
      }

      // 4. Salva as opções do produto.
      if (options.length > 0) {
        const opcoes = options.map((option) => {
          if (!option.title || typeof option.title !== 'string') {
            throw new Error('O título da opção é obrigatório');
          }

          const values = Array.isArray(option.values)
            ? option.values.join(',')
            : option.values;

          if (typeof values !== 'string' || !values.trim()) {
            throw new Error('Os valores da opção são obrigatórios');
          }

          return {
            product_id: productId,
            title: option.title.trim(),
            shape: option.shape || 'square',
            radius: option.radius ?? 0,
            type: option.type || 'text',
            values,
          };
        });

        await ProductOption.bulkCreate(opcoes, {
          transaction,
        });
      }

      // Retorna o identificador do produto criado.
      return productId;
    });
  }
}

module.exports = SequelizeProductRepository;

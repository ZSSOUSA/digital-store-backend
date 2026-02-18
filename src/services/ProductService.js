const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Product, Category, ProductImage, ProductOption, ProductCategory } = require('../models');

class ProductService {
  static async create(payload) {
    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids = [],
      images = [],
      options = [],
    } = payload;

    const product = await Product.create({
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
    });

    // categorias (pivot)
    if (Array.isArray(category_ids) && category_ids.length > 0) {
      const rows = category_ids.map((category_id) => ({
        product_id: product.id,
        category_id,
      }));
      await ProductCategory.bulkCreate(rows);
    }

    // imagens
    if (Array.isArray(images) && images.length > 0) {
      const rows = images.map((img) => ({
        product_id: product.id,
        enabled: true,
        path: img.path || img.content || '/images/default-product.png',
      }));
      await ProductImage.bulkCreate(rows);
    }

    // opções
    if (Array.isArray(options) && options.length > 0) {
      const rows = options.map((opt) => ({
        product_id: product.id,
        title: opt.title,
        shape: opt.shape || 'square',
        radius: opt.radius ?? 0,
        type: opt.type || 'text',
        values: Array.isArray(opt.values) ? opt.values.join(',') : opt.values,
      }));
      await ProductOption.bulkCreate(rows);
    }

    return product.id;
  }

  static async findById(id) {
    return Product.findByPk(id, {
      include: [
        { 
          model: ProductImage, 
          as: 'images',
          where: { enabled: true },
          required: false 
        },
        { model: ProductOption, as: 'options' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });
  }

  
  static async search(query) {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
    } = query;

    const isAll = String(limit) === '-1';
    const numericLimit = Number(limit);
    const numericPage = Number(page);

    const where = {};

    if (match) {
      where[Op.or] = [
        { name: { [Op.like]: `%${match}%` } },
        { slug: { [Op.like]: `%${match}%` } },
        { description: { [Op.like]: `%${match}%` } },
      ];
    }

    const include = [
      { 
        model: ProductImage, 
        as: 'images',
        where: { enabled: true },
        required: false 
      },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ];

    // filtrar por categoria(s)
    if (category_ids) {
      const ids = String(category_ids)
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => Number.isFinite(v) && v > 0);

      if (ids.length > 0) {
        include[1].where = { id: ids };
        include[1].required = true; 
      }
    }

    const options = {
      where,
      include,
      distinct: true, 
    };

  
    if (fields) {
      options.attributes = String(fields).split(',').map((f) => f.trim());
    }
    
    if (!isAll) {
      options.limit = numericLimit;
      options.offset = (numericPage - 1) * numericLimit;
    }

    const { rows, count } = await Product.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      limit: isAll ? -1 : numericLimit,
      page: numericPage,
    };
  }

  static async delete(id) {
    if (!Number.isFinite(id)) {
      throw new Error('ID inválido');
    }

    return sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(id, { transaction });
      if (!product) return false;

      await ProductImage.destroy({ where: { product_id: id }, transaction });
      await ProductOption.destroy({ where: { product_id: id }, transaction });
      await ProductCategory.destroy({ where: { product_id: id }, transaction });

      await Product.destroy({ where: { id }, transaction });
      return true;
    });
  }
}

module.exports = ProductService;

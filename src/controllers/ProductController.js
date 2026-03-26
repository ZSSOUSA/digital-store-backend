const ProductService = require('../services/ProductService');

class ProductController {
  static async create(req, res) {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined || price === null) {
        return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
      }

      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Preço deve ser um número positivo' });
      }

      const id = await ProductService.create(req.body);
      return res.status(201).json({ id });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const product = await ProductService.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async search(req, res) {
    try {
      const result = await ProductService.search(req.query);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido' });
      }

      const deleted = await ProductService.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ProductController;

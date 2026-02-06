const CategoryService = require('../services/CategoryService');

class CategoryController {
  static async create(req, res) {
    try {
      await CategoryService.create(req.body);
      return res.status(201).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async findById(req, res) {
    const category = await CategoryService.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    return res.status(200).json(category);
  }

static async search(req, res) {
    try {
      const result = await CategoryService.search(req.query);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = CategoryController;

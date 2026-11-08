
const ProductService = require('../services/ProductService');

const CreateProductUseCase = require('../application/use-cases/CreateProductUseCase');
const SequelizeProductRepository = require('../infrastructure/repositories/SequelizeProductRepository');

// Configuração das dependências.
// O Controller recebe o caso de uso já preparado.
const productRepository = new SequelizeProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

class ProductController {
  static async create(req, res) {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined || price === null) {
        return res.status(400).json({
          message: 'Nome e preço são obrigatórios',
        });
      }

      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          message: 'Preço deve ser um número válido não negativo',
        });
      }

      const id = await createProductUseCase.execute(req.body);

      return res.status(201).json({ id });
    } catch (error) {
      console.error('Erro ao criar produto:', error);

      // Erros de validação ou restrições do banco.
      const errosDeRequisicao = [
        'SequelizeValidationError',
        'SequelizeUniqueConstraintError',
        'SequelizeForeignKeyConstraintError',
      ];

      if (
        error.name === 'Error' ||
        errosDeRequisicao.includes(error.name)
      ) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: 'Erro interno ao criar produto',
      });
    }
  }

  static async findById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'ID inválido',
        });
      }

      const product = await ProductService.findById(id);

      if (!product) {
        return res.status(404).json({
          message: 'Produto não encontrado',
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao consultar produto:', error);

      return res.status(500).json({
        message: 'Erro interno ao consultar produto',
      });
    }
  }

  static async search(req, res) {
    try {
      const result = await ProductService.search(req.query);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);

      return res.status(500).json({
        message: 'Erro interno ao pesquisar produtos',
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'ID inválido',
        });
      }

      const deleted = await ProductService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          message: 'Produto não encontrado',
        });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);

      return res.status(500).json({
        message: 'Erro interno ao excluir produto',
      });
    }
  }
}

module.exports = ProductController;

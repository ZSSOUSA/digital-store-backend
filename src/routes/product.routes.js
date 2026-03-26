const express = require('express');
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Buscar produtos
 *     description: Retorna lista de produtos filtrados por query params (limit, page, fields, match, category_id, price-range).
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Número da página
 *       - in: query
 *         name: match
 *         schema: { type: string }
 *         description: Texto para busca no nome/descrição
 *       - in: query
 *         name: category_ids
 *         schema: { type: string }
 *         description: IDs de categoria separados por vírgula
 *       - in: query
 *         name: price-range
 *         schema: { type: string }
 *         description: Faixa de preço (ex. 50-200)
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/product/search', ProductController.search);

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     summary: Detalhe de produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do produto
 *       404:
 *         description: Produto não encontrado
 */
router.get('/product/:id', ProductController.findById);

/**
 * @swagger
 * /v1/product:
 *   post:
 *     summary: Criar produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Produto criado
 *       401:
 *         description: Não autorizado
 */
router.post('/product', authMiddleware, ProductController.create);

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     summary: Remover produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/product/:id', authMiddleware, ProductController.delete);

module.exports = router;

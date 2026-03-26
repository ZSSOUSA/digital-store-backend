const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /v1/category/search:
 *   get:
 *     summary: Listar categorias
 *     tags: [Categorias]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/category/search', CategoryController.search);

/**
 * @swagger
 * /v1/category/{id}:
 *   get:
 *     summary: Detalhe de categoria
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados da categoria
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/category/:id', CategoryController.findById);

/**
 * @swagger
 * /v1/category:
 *   post:
 *     summary: Criar categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               use_in_menu: { type: boolean }
 *     responses:
 *       201:
 *         description: Categoria criada
 *       401:
 *         description: Não autorizado
 */
router.post('/category', authMiddleware, CategoryController.create);

module.exports = router;

const express = require('express');
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     summary: Buscar produtos
 *     description: >
 *       Retorna produtos com paginação e filtros opcionais por texto
 *       e categoria. A busca textual considera nome, slug e descrição.
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: >
 *           Quantidade de produtos por página.
 *           Informe -1 para retornar todos os produtos.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página.
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: >
 *           Campos do produto que devem ser retornados,
 *           separados por vírgula.
 *         example: id,name,price
 *       - in: query
 *         name: match
 *         schema:
 *           type: string
 *         description: >
 *           Texto pesquisado no nome, slug ou descrição do produto.
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: string
 *         description: IDs das categorias separados por vírgula.
 *         example: 1,2
 *     responses:
 *       200:
 *         description: Busca realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     additionalProperties: true
 *                   description: Lista de produtos encontrados.
 *                 total:
 *                   type: integer
 *                   description: Quantidade total de produtos encontrados.
 *                 limit:
 *                   type: integer
 *                   description: Limite aplicado à busca.
 *                 page:
 *                   type: integer
 *                   description: Página atual.
 *             example:
 *               data: []
 *               total: 0
 *               limit: 12
 *               page: 1
 *       500:
 *         description: Erro interno ao pesquisar produtos.
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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do produto.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao consultar produto.
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
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produto criado.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro interno ao criar produto.
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
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Produto removido.
 *       400:
 *         description: ID inválido.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao excluir produto.
 */
router.delete('/product/:id', authMiddleware, ProductController.delete);

module.exports = router;
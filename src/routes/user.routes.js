const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /v1/user:
 *   post:
 *     summary: Cadastrar usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstname, surname, email, password, confirmPassword]
 *             properties:
 *               firstname: { type: string, example: João }
 *               surname: { type: string, example: Silva }
 *               email: { type: string, example: joao@email.com }
 *               password: { type: string, example: senha123 }
 *               confirmPassword: { type: string, example: senha123 }
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 */
router.post('/user', UserController.create);

/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/user/:id', UserController.findById);

/**
 * @swagger
 * /v1/user/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname: { type: string }
 *               surname: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/user/:id', authMiddleware, UserController.update);

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     summary: Remover usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Usuário removido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/user/:id', authMiddleware, UserController.delete);

module.exports = router;
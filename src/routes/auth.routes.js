const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

/**
 * @swagger
 * /v1/user/token:
 *   post:
 *     summary: Autenticar usuário
 *     description: Recebe e-mail e senha e retorna um JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: minhaSenha123
 *     responses:
 *       200:
 *         description: Token JWT gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: E-mail ou senha inválidos
 */
router.post('/user/token', AuthController.login);

module.exports = router;

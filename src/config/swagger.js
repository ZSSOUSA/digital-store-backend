const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Store API',
      version: '1.0.0',
      description: 'API REST do projeto Digital Store – Formação Full Stack Geração Tech.\n\nEndpoints protegidos exigem header **Authorization: Bearer {token}** (obtido via `/v1/auth/login`).',
      contact: {
        name: 'Zaqueu Silva',
        url: 'https://github.com/ZSSOUSA',
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desenvolvimento' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);

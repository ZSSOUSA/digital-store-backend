const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const {
  metricsMiddleware,
  obterMetricas,
} = require('./infrastructure/observability/metrics');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());

// Coleta métricas de duração das requisições HTTP.
app.use(metricsMiddleware);

app.use('/images', express.static(path.join(__dirname, 'images')));

// Documentação interativa da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registro dos modelos e associações
require('./models');

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API rodando. Documentação em /api-docs',
  });
});

// Métricas de observabilidade
app.get('/metrics', (req, res) => {
  res.json(obterMetricas());
});

// Rotas da API
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

app.use('/v1', userRoutes);
app.use('/v1', authRoutes);
app.use('/v1', categoryRoutes);
app.use('/v1', productRoutes);

module.exports = app;
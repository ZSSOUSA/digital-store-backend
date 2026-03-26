const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Documentação interativa da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./models');
sequelize.sync();

const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

app.get('/', (req, res) => {
  res.json({ message: 'API rodando. Documentação em /api-docs' });
});

app.use('/v1', userRoutes);
app.use('/v1', authRoutes);
app.use('/v1', categoryRoutes);
app.use('/v1', productRoutes);

module.exports = app;
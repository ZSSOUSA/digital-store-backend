const express = require('express');
const sequelize = require('./config/database');
const cors = require("cors");
const path = require('path');

const app = express();

// Servir imagens ANTES de usar CORS
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurar CORS
app.use(cors({
  origin: "http://localhost:3001",
}));

require('./models');

const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const ProductRoutes = require('./routes/product.routes');

app.use(express.json());

sequelize.sync();



app.use('/v1', userRoutes);
app.use('/v1', authRoutes);
app.use('/v1', categoryRoutes);
app.use('/v1', ProductRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API rodando....' });
});

module.exports = app;

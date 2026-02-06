require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log(' Conectado ao banco de dados');

    app.listen(PORT, () => {
      console.log(` Servidor rodando na porta ${PORT}`);
    });
    console.log(' Acesso http://localhost:3000');
  })
  .catch((error) => {
    console.error(' Erro ao conectar no banco:', error);
  });

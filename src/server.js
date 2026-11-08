
require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    // 1. Verifica a conexão com o banco
    await sequelize.authenticate();

    console.log('Conectado ao banco de dados');

    // 2. Sincroniza os modelos antes de iniciar a API
    await sequelize.sync();

    console.log('Modelos sincronizados com sucesso');

    // 3. Inicia o servidor somente após as etapas anteriores
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesso http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);

    process.exitCode = 1;
  }
}

iniciarServidor();

require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');
const logger = require('./infrastructure/observability/logger');

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    // 1. Verifica a conexão com o banco
    await sequelize.authenticate();

    logger.info('Conectado ao banco de dados');

    // 2. Sincroniza os modelos antes de iniciar a API
    await sequelize.sync();

    logger.info('Modelos sincronizados com sucesso');

    // 3. Inicia o servidor somente após as etapas anteriores
    app.listen(PORT, () => {
      logger.info('Servidor iniciado', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor', {
      errorName: error.name,
    });

    process.exitCode = 1;
  }
}

iniciarServidor();
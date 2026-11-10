
const logger = require('../../../src/infrastructure/observability/logger');

describe('Logger', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve registrar mensagens de informação em JSON', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('Servidor iniciado', { port: 3000 });

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const registro = JSON.parse(consoleSpy.mock.calls[0][0]);

    expect(registro.level).toBe('info');
    expect(registro.message).toBe('Servidor iniciado');
    expect(registro.port).toBe(3000);
    expect(registro.timestamp).toBeDefined();
  });

  it('deve registrar mensagens de alerta em JSON', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Atenção ao serviço');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const registro = JSON.parse(consoleSpy.mock.calls[0][0]);

    expect(registro.level).toBe('warn');
    expect(registro.message).toBe('Atenção ao serviço');
  });

  it('deve registrar mensagens de erro em JSON', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    logger.error('Falha ao iniciar');

    expect(consoleSpy).toHaveBeenCalledTimes(1);

    const registro = JSON.parse(consoleSpy.mock.calls[0][0]);

    expect(registro.level).toBe('error');
    expect(registro.message).toBe('Falha ao iniciar');
  });
});

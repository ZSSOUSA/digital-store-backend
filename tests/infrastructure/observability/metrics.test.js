
describe('Métricas HTTP', () => {
  let metrics;

  beforeEach(() => {
    jest.resetModules();

    metrics = require('../../../src/infrastructure/observability/metrics');
  });

  // Simula uma requisição HTTP concluída.
  function registrarRequisicao(caminho = '/') {
    let finalizarResposta;

    const req = { path: caminho };

    const res = {
      on: jest.fn((evento, callback) => {
        finalizarResposta = callback;
      }),
    };

    const next = jest.fn();

    metrics.metricsMiddleware(req, res, next);

    if (finalizarResposta) {
      finalizarResposta();
    }

    return { res, next };
  }

  it('deve registrar a duração de uma requisição HTTP', () => {
    const { res, next } = registrarRequisicao();

    const resultado = metrics.obterMetricas();

    expect(res.on).toHaveBeenCalledWith(
      'finish',
      expect.any(Function)
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(resultado.samples).toBe(1);
    expect(typeof resultado.p95_ms).toBe('number');
    expect(resultado.metric).toBe('http_request_duration_ms');
  });

  it('não deve contabilizar o próprio endpoint de métricas', () => {
    const { res, next } = registrarRequisicao('/metrics');

    const resultado = metrics.obterMetricas();

    expect(res.on).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(resultado.samples).toBe(0);
    expect(resultado.p95_ms).toBeNull();
  });

  it('deve respeitar o limite de mil amostras', () => {
    for (let i = 0; i < 1001; i += 1) {
      registrarRequisicao();
    }

    const resultado = metrics.obterMetricas();

    expect(resultado.samples).toBe(1000);
  });

  it('deve informar se o SLO está dentro da meta', () => {
    registrarRequisicao();

    const resultado = metrics.obterMetricas();

    expect(resultado.slo.target_ms).toBe(500);
    expect(resultado.slo.objective).toBe(
      '95% das requisições em até 500 ms'
    );
    expect(typeof resultado.slo.compliant).toBe('boolean');
  });
});

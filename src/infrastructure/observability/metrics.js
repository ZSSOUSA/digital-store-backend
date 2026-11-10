const { performance } = require('node:perf_hooks');

const LIMITE_AMOSTRAS = 1000;
const duracoes = [];

// Registra a duração de cada requisição HTTP concluída.
function metricsMiddleware(req, res, next) {
  // Não contabiliza o próprio endpoint de métricas.
  if (req.path === '/metrics') {
    return next();
  }

  const inicio = performance.now();

  res.on('finish', () => {
    const duracao = performance.now() - inicio;

    duracoes.push(duracao);

    // Mantém somente as mil últimas amostras.
    if (duracoes.length > LIMITE_AMOSTRAS) {
      duracoes.shift();
    }
  });

  next();
}

// Calcula o percentil 95 das durações registradas.
function calcularP95(amostras) {
  if (amostras.length === 0) {
    return null;
  }

  const ordenadas = [...amostras].sort((a, b) => a - b);
  const indice = Math.ceil(ordenadas.length * 0.95) - 1;

  return Number(ordenadas[indice].toFixed(2));
}

// Retorna a métrica e o resultado do SLO.
function obterMetricas() {
  const p95 = calcularP95(duracoes);

  return {
    metric: 'http_request_duration_ms',
    samples: duracoes.length,
    p95_ms: p95,
    slo: {
      objective: '95% das requisições em até 500 ms',
      target_ms: 500,
      compliant: p95 === null ? null : p95 <= 500,
    },
  };
}

module.exports = {
  metricsMiddleware,
  obterMetricas,
};
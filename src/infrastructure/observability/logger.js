function registrar(nivel, mensagem, contexto = {}) {
  const registro = {
    timestamp: new Date().toISOString(),
    level: nivel,
    message: mensagem,
    ...contexto,
  };

  const linha = JSON.stringify(registro);

  if (nivel === 'error') {
    console.error(linha);
    return;
  }

  if (nivel === 'warn') {
    console.warn(linha);
    return;
  }

  console.log(linha);
}

const logger = {
  info(mensagem, contexto = {}) {
    registrar('info', mensagem, contexto);
  },

  warn(mensagem, contexto = {}) {
    registrar('warn', mensagem, contexto);
  },

  error(mensagem, contexto = {}) {
    registrar('error', mensagem, contexto);
  },
};

module.exports = logger;
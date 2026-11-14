
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token nao enviado',
    });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: 'Token nao enviado',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      return res.status(401).json({
        message: 'Token invalido',
      });
    }

    // Identifica o usuario autenticado na requisicao.
    req.user = {
      id: decoded.id,
    };

    return next();
  } catch {
    return res.status(401).json({
      message: 'Token invalido',
    });
  }
};

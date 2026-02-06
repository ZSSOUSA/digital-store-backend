const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return token;
  }
}

module.exports = AuthService;

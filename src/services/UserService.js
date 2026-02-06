const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserService {
  static async create(data) {
    const { firstname, surname, email, password } = data;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new Error('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      surname,
      email,
      password: hashedPassword,
    });

    return user;
  }

  static async findById(id) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email'],
    });

    return user;
  }
}

module.exports = UserService;

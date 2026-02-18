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

  static async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;

    const data = { ...(updateData || {}) };
    delete data.id;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);

    return {
      id: user.id,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
    };
  }

  static async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }
}

module.exports = UserService;

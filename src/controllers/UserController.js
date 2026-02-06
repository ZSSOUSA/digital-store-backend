const UserService = require('../services/UserService');

class UserController {
  static async create(req, res) {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Senhas não conferem' });
      }

      await UserService.create({ firstname, surname, email, password });

      return res.status(201).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await UserService.update(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserService.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserController;

const AuthService = require('../services/AuthService');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const token = await AuthService.login(email, password);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;


jest.mock('../../src/services/UserService');

const UserService = require('../../src/services/UserService');
const UserController = require('../../src/controllers/UserController');

describe('UserController - seguranca de acesso', () => {
  const criarResponse = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
      send: jest.fn(),
    };

    res.status.mockReturnValue(res);

    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    test('deve permitir consultar a propria conta', async () => {
      const req = {
        params: { id: '2' },
        user: { id: 2 },
      };

      const res = criarResponse();

      const usuario = {
        id: 2,
        firstname: 'Zaqueu',
        email: 'teste@example.com',
      };

      UserService.findById.mockResolvedValue(usuario);

      await UserController.findById(req, res);

      expect(UserService.findById).toHaveBeenCalledWith('2');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuario);
    });

    test('deve bloquear consulta de outra conta', async () => {
      const req = {
        params: { id: '3' },
        user: { id: 2 },
      };

      const res = criarResponse();

      await UserController.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(UserService.findById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    test('deve permitir atualizar a propria conta', async () => {
      const req = {
        params: { id: '2' },
        user: { id: 2 },
        body: { firstname: 'Zaqueu Atualizado' },
      };

      const res = criarResponse();

      const usuarioAtualizado = {
        id: 2,
        firstname: 'Zaqueu Atualizado',
      };

      UserService.update.mockResolvedValue(usuarioAtualizado);

      await UserController.update(req, res);

      expect(UserService.update).toHaveBeenCalledWith(
        '2',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usuarioAtualizado);
    });

    test('deve bloquear atualizacao de outra conta', async () => {
      const req = {
        params: { id: '3' },
        user: { id: 2 },
        body: { firstname: 'Alteracao indevida' },
      };

      const res = criarResponse();

      await UserController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(UserService.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('deve permitir excluir a propria conta', async () => {
      const req = {
        params: { id: '2' },
        user: { id: 2 },
      };

      const res = criarResponse();

      UserService.delete.mockResolvedValue(true);

      await UserController.delete(req, res);

      expect(UserService.delete).toHaveBeenCalledWith('2');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test('deve bloquear exclusao de outra conta', async () => {
      const req = {
        params: { id: '3' },
        user: { id: 2 },
      };

      const res = criarResponse();

      await UserController.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(UserService.delete).not.toHaveBeenCalled();
    });
  });
});

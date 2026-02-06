const express = require ('express')
const UserController = require ('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/user', UserController.create);
router.get('/user/:id', UserController.findById);

router.put('/user/:id', authMiddleware, UserController.update);
router.delete('/user/:id', authMiddleware, UserController.delete);




module.exports = router
const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')

// идем в userRouter.js -> тут экспортим и передаем вторым параметром в get() запрос, который будет проверять пользователя на авторизованность

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;

// теперь перейдем к реализации  -> открываем наш userController.js
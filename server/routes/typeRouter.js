// переходим в typeRouter.js ->  сюда этот checkRoleMiddleware.js импортим и вторым параметром мы этот middleware не просто передаем, а ВЫЗЫВАем! Нам необходимо, чтобы после вызова этой функции как раз туда попал middleware. Параметром туда передаем РОЛЬ ADMIN.
const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware') 

router.post('/', checkRole('ADMIN'), typeController.create) // таким образом, товары в нашем магазине теперь могут добавлять только администраторы. Этот middleware необходимо добавить на создание девайсов, брендов
router.get('/', typeController.getAll)

module.exports = router;
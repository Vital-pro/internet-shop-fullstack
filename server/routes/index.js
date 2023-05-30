//* Это основной роутер нашего приложения. Будет объединять все маршруты Связующее звено
const Router = require('express');
const router = new Router();
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')



//? т.к. те файлы (brandRoutes.js, deviceRoutes.js, typeRoutes.js, userRoutes.js) будут являться под-роутерами, т.е. какой-то его частью, мы должны в этом основном роутере это указать. Вызываем функцию use..

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)

module.exports = router;

//? на этом этапе мы объединили все четыре роута в один, но наш сервер пока не знает об этом. Нужно сообщить ему. Идем в корневой index.js и импортируем ОСНОвной роутер!
// * const router = require('./routes/index')
//? и пишем 
//*  app.use('/api', router)

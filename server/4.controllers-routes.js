    //    *Всё работает! Связь backend и frontend налажена, запросы работают! Теперь можем заняться нормальной разработкой!))

   //* Теперь зададим каркас нашего приложения. Начнем с маршрутов routes, по которым будут отрабатывать те или иные методы...
   // создадим in folder Server -> folder routes (отдельный папка с маршрутами). Внутри routes -> files:
   brandRouter.js   // route for brand
   deviceRouter.js  // route for device
   typeRouter.js    // route for type
   userRouter.js    // route for user
   index.js     // этот файл index.js будет все маршруты объединять, т.е. связующее звено
   
     //* переходим в этот index.js Это основной роутер нашего приложения -> :

const Router = require('express');
const router = new Router();

//? т.к. те файлы (brandRoutes.js, deviceRoutes.js, typeRoutes.js, userRoutes.js) будут являться под-роутерами, т.е. какой-то его частью, мы должны в этом основном роутере это указать. Вызываем функцию use..

router.use('/user', )
router.use('/type', )
router.use('/brand', )
router.use('/device', )

module.exports = router;

    //* Но роутер так станет постепенно огромным и правильно логику отделять. Для этого создадим in folder Server -> folder controllers. А в ней создадим для каждого роутера соответствующий controllers:

    brandController.js
    deviceController.js
    typeController.js
    userController.js

   
   
   
   
   
   *Дальше. Приступим к реализации регистрации и авторизации.*
Внутри folder server create -> 2 folder:
 - routes 
 - controllers

 *routes* - это '/', routе, end points, handlers, "ручка", адрес, на который мы будем отправлять запросы на бэкенд. А бэкенд, принимая запрос на тот или иной '/', понимал, что хочет user на стороне frontend-a, что нужно с ним делать.

 *controllers* - как раз тут будут функции, где описана вся логика

 - ...(req, res) => {}...

 *req* - это то, что приходит к нам со стороны клиента, от пользователя.
 req.body - это данные пришли из полей, которые заполнил пользователь на фронтенде

 *res* - это то, что после того, как мы получили данные из req, например, регистрацию, и через res мы будем отправлять данные обратно на сторону клиента, т.е. на frontend.

*Т.е. req приходит к нам ОТ frontend, мы обрабатываем и отправляем из backend обратно res НА frontend*
- req - получаем,  res - отправляем обратно



- Далее уже методом декомпозиции будем дробить файлы по папкам.

**in routes -> create file auth.js для авторизации.**

import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth';

const router = new Router(); // создаем экземпляр класса Router

 - и описываем routes, которые будут использоваться для того или иного действия.
 
//! Register (post)
//  http://localhost:3000/api/auth/register

router.post('/register', register);

//! Login    (post)
//  http://localhost:3000/api/auth/login

router.post('/login', login);

//! Get Me -а здесь только получаем данные по запросу (get)
//  http://localhost:3000/api/auth/me

router.get('/me', getMe);


export default router;

 - Теперь подключим в app.js:

сверху - import authRoute from './routes/auth.js';

ниже   - app.use('/api/auth', authRoute);

**in controllers -> также create file auth.js для авторизации.**

// Register user
// Login user
// Get Me

......
//* Register user
export const register = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

.....
//* Login user
export const login = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

.....
//* Get Me
export const getMe = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

# Теперь можем приступать к регистрации пользователей
когда уже данные нужно будет записать в БД, с username проблем нет, а с password воспользуемся шифрованием. 
Чтобы не напрямую писали пароль в БД, а захешировали. Воспользуемся bcryptjs, который скачали ранее.

import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash,
})
//fghgfh
//*hfghgfh
//todo dfgdfg
//? gfhgfh
//!ghghgfh


https://www.youtube.com/watch?v=H2GCkRF9eko


// todo Удобнее сначала написать полностью backend, а потом написать полностью frontend, но здесь будем постепенно

      // * START NEW project

                               folder client (frontend)
 in folder(project) create ->
                               folder server (backend)

                               
// ! Важно! Фронтенд по умолчанию использует порт 3000. Поэтому для бэка нужно везде ниже писать 3001!**

 // переходим in folder server: cd server -> create package.json:

 // ? npm init -y

//  ? npx eslint --init  // инициализация пакетов ESLint для проверки и исправления кода. (здесь выбираем использование React-a)

В файле .eslintrc можем настраивать ESLint:
  rules: {
   'react/function-component-definition': 'off',
   'import/no-extraneous-dependencies': 'off',
   'react/prop-types': 'off',
   'import/prefer-default-export': 'off',
 },

 //? npx create-gitignore Node (npx gitignore node) - создать файл .gitignore
// * (если вручную, то внутрь пропишем node_modules/, чтобы пушить без опаски)

 //! create Stack backend: express pg pg-hstore sequelize sequelize-cli cors dotenv 
*npm i express pg pg-hstore sequelize sequelize-cli cors dotenv *

 //a для отслеживания измeнений нашего backend in live, чтобы вручную не перезапускать постоянно server:
*npm i -D nodemon* - как devDependencies, зависимость только для разработки

//* **start**в этом проекте не надо***********
//? Чтобы писать backend в современном синтаксисе 'import', а не 'require', пишем в package.json:*
//? "description": "",
//? "main": "index.js",
//? "type": "module",
//* **finish**в этом проекте не надо*********

// Ещё в package.json сделаем изменения:*

 вместо:
> "scripts": {
>  "test": "echo \"Error: no test specified\" && exit 1"
>  },

  пишем:
"scripts": {
 "dev": "nodemon index.js"
},

 //  Дальше.. т.к. в package.json есть "main": "index.js" (! это входной, корневой файл) create in folder server ->
//  -> file *index.js* - это входной, корневой файл всего нашего server. С него будет начинаться запуск! В нем пишем:

const express = require ('express');  // импортим express

const PORT = 3001; // потом заменим на переменную окружения     
//? const PORT = process.env.PORT || 3001; 

// ! Важно! Фронтенд по умолчанию использует порт 3000. Поэтому для бэка нужно везде ниже писать 3001! или др.**

const app = express();         //так создается приложение в фреймворке express. С него и будет начинаться запуск нашего приложения 


app.listen(PORT, () => {
 console.log('Server started...! on port:', PORT);  // так поднимается server
});                                                // пишем енд поинт (handler) проверим, что сервер работает 

...и запускаем server в терминале:

 // *npm run dev*


 //*Но в таком открытом виде оставлять нельзя! Хранить данные внутри кода приложения нельзя!
 Создадим -> in folder server create fail .env*

Чтобы задавать переменные окружения, подключим пакет 'dotenv' in index.js:

require ('dotenv').config()  // так наверху импортим

dotenv.config();        // так просто вызываем и всё. после const app = express()


В нем можно create const's и присвоить им:

const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

...и потом их использовать. Можно и напрямую без const, но так нагляднее и удобнее



   //*    Теперь создаем БД. Создаем PostgreSQL 

(ранее уже подключил pg pg-hstore sequelize sequelize-cli)
Sequelize — это инструмент для организации взаимодействия между платформой Node. js и реляционными базами данными без использования специального языка запросов SQL

добавим в корень проекта автоматически: touch .sequelizerc или вручную .sequelizerc  ("." точку в начале не забыть)

*  затем внутри .sequelizerc пропишем команду из документации, чтобы поднять БД:
   
const path = require('path');
module.exports = {
 'config': path.resolve('db', 'config', 'database.json'),
 'models-path': path.resolve('db', 'models'),
 'seeders-path': path.resolve('db', 'seeders'),
 'migrations-path': path.resolve('db', 'migrations'),
};

npx sequelize-cli init     (здесь npX)!! иницилизируем проект
 
В корневой папке директории должны появиться 4 папки:
config
models
migrations
seeders 

В файле database.json делаем изменения, прописываем подключение к новой базе

 "development": {
   "username": "admin",
   "password": "123",
   "database": "myNewDataBase",
   "host": "127.0.0.1",
   "dialect": "postgres"
 },    


npx sequelize db:create  
# БД создана!

**Соединение с БД при помощи sequelize** 
https://my-js.org/docs/guide/sequelize/
https://metanit.com/web/nodejs/9.2.php

 **подключим стартовый скрипт в package.json для запуска старта (npm run dev):
"scripts": {
>   "test": "echo \"Error: no test specified\" && exit 1",
   "start": "node sql.js"
 },

 **создадим в корне sql.js (например), в него подключим Sequelize:

const { Sequelize } = require('sequelize');  - соединили саму библиотеку

const sequelize = new Sequelize('myDataBase', 'myUsername', 'myPassword', {
 host: 'localhost',     - пока наша database у нас на локальном компе
 dialect: 'postgres'
});                      - соединили наш будущий код с базой данных


 const testDB = async () => {
 try {
   await sequelize.authenticate();
   console.log('Connection has been established successfully.');
   app.listen(PORT, () => console.log('Server started...! on port:', PORT));
 } catch (error) {
   console.error('Unable to connect to the database:', error);
 }
};

testDB();    !и не забудем вызвать:

и запускаем npm run dev. Если получим....: 
Executing (default): SELECT 1+1 AS result
Connection has been established successfully. 

!! то всё успешно подключено!
 Больше эта функция не нужна, комментим либо удаляем.

_---нужно изучить----start----------------------------_
** Ниже пример другого варианта подключения, в одну строку:
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres
const sequelize = new Sequelize('postgres://admin:123@localhost:5432/myNewDataBase') //  это Example с нашими данными**
_---нужно изучить-----finish----------------------------_

*** Всё. Подключились! Можем отправлять из JavaScript запросы в postgres!**


---------------------------------------
* входим в psql:
sudo -i -u postgres
psql

\l посмотреть все БД в postgres
\du посмотреть список ролей
\q  Выйти из клиента PostgreSQL
!! ctrl + D !!! выход из любого места
---------------------------------------
//////////////////////////////////////////////////////////////////////////////////

         убить зависший localhost:3000 или др
Проверьте PID, т.е. идентификатор процесса, работающего на порту 3000, с помощью следующей команды:

sudo lsof -i :3000  или sudo lsof -i tcp:3000
Это выведет что-то вроде следующего:

COMMAND  PID   USER   FD   TYPE  DEVICE  SIZE/OFF NODE NAME
node     5805  xyz    12u  IPv6  63135    0t0     TCP  *:3000 (LISTEN)
Теперь убейте процесс, используя:

kill -9 5805

////////////////////////////////////////////////////////////////////////////////////

      //**Дальше.. Сделаем минимальные настройки нашего express**:
импортируем некоторые переменные in index.js:

const cors = require('cors') //чтобы наш бэкенд разрешал запросы с разных IP-адресов из браузеров


        // *для подключения создадим нужные  middleware()-->
//- Мiddleware()- это функция, которая либо расширяет, либо дополняет базовые настройки нашего express.
*app.use(...handlers)*  // this syntax-->

app.use(cors()); //запускаем просто вызовом функции cors()-запросы с разных IP-адресов
app.use(express.json()); // express будет понимать, что данные будут приходить в формате .json, (req.body, т.е. тело запроса, например из form), т.к. из фронтенда мы будем отсылать данные в формате .json,

//**...теперь уже что-то протестируем. Создадим роут, по которому будет что-то отдаваться**

   //* Routes or Endpoints*

   app.get('/', (req, res) => {
    res.status(200).json({message: 'WORKING!!!'})
  })

 app.get('/', (req, res) => {
    return res.send('Hello!')
 })  //       - this template 

app.get('/', (req, res) => {
 return res.status(200).json({message: 'All good!'})
})

      // !   *Всё работает! Связь backend и frontend налажена, запросы работают! Теперь можем заняться нормальной разработкой!))

   //* Теперь зададим каркас нашего приложения. Начнем с маршрутов routes, по которым будут отрабатывать те или иные методы...

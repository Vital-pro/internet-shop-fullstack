require('dotenv').config();
const express = require('express');
//const sequelize = require('../server/db'); //?так написал Я, что правильно ?
const sequelize = require('./db'); //?так написал ОН, что правильно ?
const models = require('./models/models'); // импортим все созданные модели. И пошли запросы на создание моделей
const cors = require('cors');
const fileUpload = require('express-fileupload')
const router = require('./routes/index') //экспортим основной роутер, который связывает все роутеры
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload( {} ))
app.use('/api', router)


// Обработка ошибок. Но! обязательно в index.js  middleware, который работает с ошибками, обязательно должен идти и регистрироваться в самом конце!! И т.к. этот middleware является замыкающим, то мы нигде внутри него НЕ вызвали функцию next, поскольку на нём работа прекращается, и мы возвращаем на client ответ.
app.use(ErrorHandler)

app.get('/', (req, res) => {
  res.status(200).json({message: 'WORKING!!!'})
})

const start = async () => {
  try {
    await sequelize.authenticate();  // с ее помощью и устанавливается подключение к БД
    await sequelize.sync();  // эта фун-ция сверяет состояние БД со схемой данных (которую напишем позже)
    app.listen(PORT, () => console.log(`Server started..! on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start(); // не забываем вызвать!

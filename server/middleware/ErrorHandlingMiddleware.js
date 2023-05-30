const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};

// следующим этапом перейдем в index.js и там необходимо будет зарегистрировать этот middleware
//! Но! обязательно в index.js  middleware, который работает с ошибками, обязательно должен идти и регистрироваться в самом конце!! И т.к. этот middleware является замыкающим, то мы нигде внутри него НЕ вызвали функцию next, поскольку на нём работа прекращается, и мы возвращаем на client ответ.

// app.use(ErrorHandler)

// Теперь открываем userController.js и здесь в фун -ции check в условии if() проверим
// async check(req, res, next) {
//   const {id} = req.query;
//   if (!id) {
//     return next(ApiError.badRequest('Не задан ID!'))
//   }
//   res.json(id)
// }
// а вот перед тем, как реализовать check(), реализуем еще один middleware.
// Именно в нем будем ДЕКОДировать ТОКен и проверять его на ВАЛИдность
// Если токен не валидный, будем сразу возвращать, что user не авторизован
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    // нас интересуют только методы GET, POST, PUT, DELETE
    next();
  }
  try {
    // вытаскиваем токен из headers.authorization. Но в headers обычно сначала
    // помещают тип токена, а потом сам токен. Выглядит это примерно так: сначала
    // пишется Вearer (в нашем случае это тип токена), а потом fasfdfgdfgdgd (сам токен)
    //Поэтому по пробелу нам нужно два этих слова друг от друга отлепить, и по первому
    // индексу получить непосредственно сам токен
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован!' });
    }
    //если токен есть, раскодируем его. verify() проверит на валидность
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next(); // и во всех следующих ф-циях этот user будет доступен
  } catch (e) {
    res.status(401).json({ message: 'Не авторизован!' });
  }
};
// идем в userRouter.js -> и там передаем вторым параметром в get()запрос, который будет проверять пользователя на авторизованность

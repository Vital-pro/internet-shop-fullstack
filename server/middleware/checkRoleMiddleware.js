// на данный момент мы можем добавлять, получать Type, Brand, Device, НО это может сделать ЛЮБой user, а нужно, чтобы эта возможность была только у АДМИНИстратора. Поэтому создаем новый middleware -> checkRoleMiddleware.js Копируем туда authMiddleware.js - логика будет похожая.

const jwt = require('jsonwebtoken');

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
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
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Нет доступа!' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: 'Не авторизован!' });
    }
  };
};

// переходим в typeRouter.js ->  туда этот checkRoleMiddleware.js импортим
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
  return jwt.sign(
    { id, email, role }, //тот самый PAYLOAD, центральная часть
    process.env.SECRET_KEY, // тот самый секретный ключ
    { expiresIn: '24h' } // сколько живет токен, можно месяц или вечно
  );
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = await req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password!'));
    }
    // теперь проверим, есть ли в системе user с таким email
    const candidate = await User.findOne({ where: { email } });

    //следующим этапом задаем условия
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь с таким email уже существует!')
      );
    }

    //если user с таким email мы не нашли-хешируем пароль
    const hashPassword = await bcrypt.hash(password, 5);

    //затем создаем user с помошью create( {email, role, password} )
    const user = await User.create({ email, role, password: hashPassword });

    //сразу же для user создаем корзину Basket
    const basket = await Basket.create({ userId: user.id });

    // теперь надо сгенерировать тот самый jsonwebtoken Сначала import, потом:
    const token = generateJwt(user.id, user.email, user.role);

    return res.json({ token }); //как токен сгенерирован, возвращаем на client
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    //проверяем, существует ли user с таким email в БД
    const user = await User.findOne({ where: { email } });

    // но, в отличие от регистрации, проверяем:
    if (!user) {
      return next(ApiError.internal('Пользователь не найден!'));
    }

    //если проверку прошли, теперь сверим пароли от user в form и в БД
    // но в БД захешированный пароль, поэтому нужен bcrypt
    // 1парам: тот, который ввел user, 2парам: который есть в БД
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль!'));
    }

    //затем также генерируем токен и передаем нужные параметры
    const token = generateJwt(user.id, user.email, user.role);
    //и на клиент возвращем по аналогии с рег-ей САМ ТОКЕН
    return res.json({ token });
  }

  //* а вот перед тем, как реализовать check(), реализуем
  //* еще один middleware. Именно в нем будем ДЕКОДировать
  //* ТОКен и проверять его на ВАЛИдность
  // В принципе, вся функция check() будет сводиться к тому, чтобы сгенерировать
  // новый токен и отправить его обратно на клиент. Грубо говоря, если user постоянно
  // использует свой аккаунт, токен у него будет постоянно перезаписываться
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();

// на данный момент мы можем добавлять, получать Type, Brand, Device, НО это может сделать ЛЮБой user, а нужно, чтобы эта возможность была только у АДМИНИстратора. Поэтому создаем новый middleware -> checkRoleMiddleware.js
// 
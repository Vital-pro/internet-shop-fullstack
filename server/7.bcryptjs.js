// * 54,42 мин Вот, вроде и закончили с типами (TypeController ), брендами (BrandController) и с устройствами (DeviceController) В принципе, основная составляющая магазина готова. Осталось разобрать с регистрацией и авторизацией
https://www.youtube.com/watch?v=fN25fMQZ2v0
https://www.youtube.com/watch?v=dDeWWQWMM-Y
https://www.youtube.com/watch?v=p3RFMEixUOE
//*     Небольшое теоретическое вступление: авторизация будет происходить по JWT-токену
//todo JWT-токен или токен доступа - это простая строка, разделенная точками на три части. По большей части, нас интересует центральная часть - Payload. Туда мы будем прятать данные о пользователе. Это его email, id, role (роль). После того, как пользователь зарегистрировался, ввёл email и пароль, для него генерируется подобный токен. Все его данные вшиваются в середину. И что тут важно понимать: эти данные никак не шифруются, они никакой секретной информации не несут. И мы на client-е можем спокойно их расшифровывать. НО!! проверить на то ВАЛИДЕН токен или нет можно только с помощью секретного ключа, который объявлен на сервере. И вот ЕГО, по идее, никто знать не должен.
// Вообщем, пользователь вводит email, пароль. В первую очередь мы проверяем, существует ли пользователь с таким email в нашей системе. Если да, то сравниваем пароль, который находится в БД с паролем, который написал пользователь. Если эти пароли совпадают, мы генерируем JWT-токен и отправляем его на client. После чего НА КЛИЕНТЕ этот токен где-то сохраняется:
// - либо в cookie, - либо в localstorage. Безопаснее, конечно в cookie, но сейчас речь не об этом. -> 
// -> Затем этот токен прикрепляется к запросам, там, где необходима авторизацияю Допустим, в корзину мы не можем зайти, если не авторизованы. Авторизуемся: Сlient -> отправляет запрос с данными на server (авторизуется) -> Server генерирует ТОКЕН и возвращает его обратно на Сlient. Затем мы нажимаем на кнопку "Войти в корзину", и у нас отправляется запрос на получение товаров. К этому запросу в Headers в HTTP-заголовки мы добавляем Authorization и туда помещаем тот самый ТОКЕН, который мы достаем, опять же, из cookie или из localstorage. Сервер ВАЛИДИрует этот токен по секретному ключу. И, если он ВАЛИДЕН, то пользователь попадает на страницу корзины и получает все товары, которые у него там находятся.
//* Итого с помощью JWT-токена обеспечивается доступ к той или иной функции.

// Приступим к реализации, установим jsonwebtoken и bcrypt:
//  - jsonwebtoken - для генерации того самого веб-токена
//  - bcrypt - для того, чтобы хешировать пароли и не хранить их в БД в открытом виде

//* npm i jsonwebtoken bcrypt

// Прямо в UserController.js имортим bcrypt, также понадобятся модели пользователя и корзины
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const { User, Basket } = require('../models/models');

// Начнем с регистрации



//? это из другой работы...
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
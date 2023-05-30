//*      Теперь переходим к этапу создания middleware. In folder Server -> create -> new folder *Middleware* -> next *file ErrorHandlingMiddleware.js*

const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};

// следующим этапом перейдем в index.js и там необходимо будет зарегистрировать этот middleware
//! Но! обязательно в index.js  middleware, который работает с ошибками, обязательно должен идти и регистрироваться в самом конце!! И т.к. этот middleware является замыкающим, то мы нигде внутри него НЕ вызвали функцию next, поскольку на нём работа прекращается, и мы возвращаем на client ответ.

app.use(ErrorHandler)

// Теперь открываем userController.js и здесь в фун-ции check в условии if() проверим (не забываем async)
async check(req, res, next) {
  const {id} = req.query;
  if (!id) {
    return next(ApiError.badRequest('Не задан ID!'))
  }
  res.json(id)
}

//Проверяем в браузере или в Postman (клиент для запросов на сервер) выдает, конечно, 'Не задан ID!'. Теперь, если введем в браузерную строку после слэша /?id=5 (http://localhost:3001/api/user/auth/?id=5) -> то выведет "5"

//*       Теперь идем дальше, пока начнем с простого, научимся добавлять в БД объекты
// начнем с типов -> переходим в typeController.js

const {Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
  async create(req, res) {
    const {name} = req.body
    const type = await Type.create({name})
    return res.json(type)
  }

  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }

}

module.exports = new TypeController();

// теперь переходим в -> typeRouter.js туда импортируем typeController.js
const Router = require('express');
const router = new Router();

const typeController = require('../controllers/typeController')

router.post('/', typeController.create)
router.get('/', typeController.getAll)

module.exports = router;

// ..то же самое и с Brand, BrandController и т.д.

//*   Теперь переходим в DeviceController.js, тут будет всё сложнее
// получить изображение img нужно тоже из запроса, но чуть иначе. Так просто не получится, для этого в *req* есть другое поле -> req.files. Но, чтобы с ним работать, нужно установить пакет из npm -> npm i express-fileupload.
 //* Его также необходимо зарегистрировать -> возвращаемся в index.js, пишем require после const cors = require('cors');  -> 
 const fileUpload = require('express-fileupload')
 //* и регистрируем после app.use(express.json())
 app.use(fileUpload( {} )) // не забудем передать параметрами пустой объект с опциями!
//*         и теперь можем работать с файлами!

// возвращаемся в DeviceController.js и продолжаем работать с нашей фун-цией
// НО после того, как получим файл нам для него необходимо сгенерировать уникальное имя, чтобы потом по этому имени мы этот файл могли получать. Для этого установим пакет -> uuid. Он будет генерировать рандомные случайные id-шники, которые не будут повторятся
//* npm i uuid
// импортируем его в DeviceController.js
const uuid = require('uuid')
const path = require('path') // модуль Node.js

class DeviceController {
  async create(req, res) {
    const {name, price, brandId, typeId, info} = await req.body
    const {img} = req.files
    let filName = uuid.v4() + '.jpg'
    
  }

  async getAll(req, res) {}

  async getOne(req, res) {}

}

module.exports = new DeviceController();

//*  Теперь создадим еще одну папку -> in folder server -> которую назовем static. В неё будем перемещать все файлы, которые будут отправлять с клиента, а затем научим наш сервер эти файлы отдавать как статику. Чтобы мы через браузер могли эти файлы спокойно получать. 
// И, чтобы файл после получения мы могли переместить в эту папку, вызовем функцию mv()
// сначала воспользуемся модулем 'path' из Node.js -> у него вызовем функцию resolve, которая адаптирует указанный путь к ОС (операционной системе). Передаем первым параметром: __dirname (это путь до текущей папки с контроллерами), вторым (через запятую) указываем: '..' (чтобы вернуться на директорию назад) и папку: 'static'. 
//Таким образом мы переместим файл с заданным именем в нужную для нас папку.
img.mv(path.resolve(__dirname, '..', 'static', fileName))

// СЛедующим этапом, после того, как файл перемещен, нам необходимо создать непосредственно сам Device. Для этого импортируем сюда модель из папки моделей, вызываем функцию create( {name, price, brandId, typeId, img: fileName} ) с необходимыми параметрами
const device = await Device.create({
  name, price, brandId, typeId, img: fileName
})

// И, после того, как Device мы создали, return информацию о нём обратно на client. Здесь потенциально может быть какая-нибудь ошибка, поэтому обернем в try - catch. В catch вызываем, как обычно ф-цию next() Итого:
const uuid = require('uuid');
const path = require('path'); // модуль Node.js
const { Device } = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = await req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {}

  async getOne(req, res) {}
}

module.exports = new DeviceController();

//* Но еще необходимо явно указать серверу, что файлы из папки static необходимо раздавать как статику, чтобы мы могли их спокойно получать. Для этого в основном index.js напишем: 
app.use(express.static(path.resolve(__dirname, 'static')))
// И,конечно, не забудем const path = require('path')

//Возвращемся в DeviceController.js и реализуем ф-цию для получения всех девайсов Device -> async getAll(req, res) {}:
async getAll(req, res) {
  const { brandId, typeId } = req.query;
  let devices;
  if(!brandId && !typeId) {}
  if(brandId && !typeId) {}
  if(!brandId && typeId) {}
  if(brandId && typeId) {}

  return res.json(devices)
}

// Для постраничного вывода доавим еще два параметра: это текущая страница - page м лимит - limit (кол-во девайсов на одной странице). Заменим const на let.
let { brandId, typeId, limit, page } = req.query;
// Сразу зададим дефолтные значения
page = page || 1; //если стр не указана, по дефолту сделаем ее первой
    limit = limit || 9; // если limit не указан, по дефолту пусть будет 9 шт
    let offset = page * limit - limit; //это отступ. Нап-р, перешли на стр 2 и первые девять товаров нам нужно пропустить
    let devices;

// НО, чтобы посчитать кол-во страниц на фронте, нам нужно знать общее кол-во товаров, которое вернется нам по заданному запросу. Для этого вместо findAll() есть другая ф-ция: findAndCountAll Он нужна как раз для пагинации
//* Итого так выглядит DeviceController.js:

const uuid = require('uuid');
const path = require('path'); // модуль Node.js
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = await req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info)
        info.forEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        });
      }


      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {

    let { brandId, typeId, limit, page } = req.query;
    page = page || 1; //если стр не указана, по дефолту сделаем ее первой
    limit = limit || 9; // если limit не указан, по дефолту пусть будет 9 шт
    let offset = page * limit - limit; //это отступ. Нап-р, перешли на стр 2 и первые девять товаров нам нужно пропустить
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset }); // НО, чтобы посчитать кол-во страниц на фронте, нам нужно знать общее кол-во товаров, которое вернется нам по заданному запросу. Для этого вместо findAll() есть другая ф-ция: findAndCountAll Он нужна как раз для пагинации
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
    }

    return res.json(devices);
  }

  async getOne(req, res) {}
}

module.exports = new DeviceController();

// * Остается последней одна нереализованная ф-ция async getOne(req, res) {} -получения одного конкретного девайса
async getOne(req, res) {
  const {id} = req.params
  const device = await Device.findOne(
    {
      where: {id},
      include: [{model: DeviceInfo, as: 'info'}]
    },
  )
  return res.json(device)
}

//todo И вот Итоговый file DeviceController.js:

const uuid = require('uuid');
const path = require('path'); // модуль Node.js
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = await req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info)
        info.forEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        });
      }


      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {

    let { brandId, typeId, limit, page } = req.query;
    page = page || 1; //если стр не указана, по дефолту сделаем ее первой
    limit = limit || 9; // если limit не указан, по дефолту пусть будет 9 шт
    let offset = page * limit - limit; //это отступ. Нап-р, перешли на стр 2 и первые девять товаров нам нужно пропустить
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset }); // НО, чтобы посчитать кол-во страниц на фронте, нам нужно знать общее кол-во товаров, которое вернется нам по заданному запросу. Для этого вместо findAll() есть другая ф-ция: findAndCountAll Он нужна как раз для пагинации
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const {id} = req.params
    const device = await Device.findOne(
      {
        where: {id},
        include: [{model: DeviceInfo, as: 'info'}]
      },
    )
    return res.json(device)
  }
}

module.exports = new DeviceController();

//* Вот, вроде и закончили с типами (TypeController ), брендами (BrandController) и с устройствами (DeviceController) В принципе, основная составляющая магазина готова. Осталось разобрать с регистрацией и авторизацией

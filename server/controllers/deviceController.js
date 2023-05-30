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

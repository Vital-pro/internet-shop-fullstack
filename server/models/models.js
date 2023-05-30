const sequelize = require('../db');
const { DataTypes } = require('sequelize'); //из самого пакета sequelize импортируем класс DataTypes, с помощью которого описываются типы того или иного поля: STRING, INTEGER т.д.

// И начнем описывать модели:

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}); // на отсутствие внешнего ключа (primaryKey) пока не обращаем внимания. Его sequelize подставит сам, когда мы будем описывать типы связей (belongsTo, belongsToMany) чуть позже, ниже.

const BasketDevice = sequelize.define('basket_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

//? а эта связующая модель создается специально для связи многие ко многим belongsToMany
const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}); // здесь будет всего одно поле с id. Остальные поля, т.е. внешние ключи (primaryKey) sequelize добавит сам, когда мы вызываем функции (belongsToMany), sequelize будет все внешние ключи добавлять автоматически.

// А теперь настал момент описать того, как эти модели связаны друг с другом! Делается это таким образом:
//*обращаемся к модели и вызываем соответствующую функцию - hasMany или hasOne -:

User.hasOne(Basket); //связь м\у User(пользователем) и Basket(корзиной) один к одному
Basket.belongsTo(User); //говорим, что Basket(корзина) принадлежит User(пользователю)

User.hasMany(Rating); // один User(пользователь) может иметь несколько оценок
Rating.belongsTo(User); // для Rating говорим, что принадлежит User(пользователю)

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, {as: 'info'}); //так мы говорим, что одна запись Device в БД содержит МНОго записей с характеристиками
DeviceInfo.belongsTo(Device); // указываем для DeviceInfo, что эта сущность принадлежит Device

Type.belongsToMany(Brand, { through: TypeBrand }); //? так для связи многие ко многим belongsToMany
Brand.belongsToMany(Type, { through: TypeBrand }); //? так для связи многие ко многим belongsToMany

// и не забываем экспортировать:
module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  DeviceInfo,
  TypeBrand,
};
//? возвращаемся в файл index.js, туда все модели импортируем const models = require('./models/models');  видим в логах кучу!! сообщений Это как раз запросы к БД, чтобы создать те или иные модели!

//! БД создана!

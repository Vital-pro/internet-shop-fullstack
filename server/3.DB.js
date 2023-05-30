  //*    Теперь создаем БД. Создаем PostgreSQL 

 (ранее уже подключил pg pg-hstore sequelize sequelize-cli)
Sequelize — это инструмент для организации взаимодействия между платформой Node. js и реляционными базами данными без использования специального языка запросов SQL

//todo Создаем в папке server файл db.js Потом просто через DBeaver создадим БД, назовем её *online_store* Все настройки подключения к БД вынесем в переменные окружения -> fail .env*

PORT=3001
DB_NAME=online_store  // название базы, (my_name_db)
DB_USER=postgres     //  admin (это сейчас у меня здесь) имя пользователя для подключения
DB_PASSWORD=root    //   123    (сейчас у меня здесь такой пароль)
DB_HOST=localhost  //   localhost- т.к. сейчас мы в режиме разработки
DB_PORT=5432      //   такой порт по умолчанию для PostgreSQL 

//* Т.к. модуль большой, а нам нужен конкретно этот класс, делаем деструктуризацию. Дальше в файле db.js пишем:
const { Sequelize } = require('sequelize');

 //экспортируем объект, который мы создаем из этого класса, 
 //в конструкторе и будем указывать КОНФИгурацию, передаем все эти переменные в него
module.exports = new Sequelize(
  process.env.DB_NAME,     // название БД
  process.env.DB_USER,     // имя пользователя, под которым мы подключаемся к БД
  process.env.DB_PASSWORD, // пароль
  {
    dialect: 'postgres',       // смотря на какой БД работаем
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);  

//* На этом закончили с кофигурацией. Возвращаемся в *index.js*, и туда импортируем (import) объект, который мы сделали в файле *db.js* (и который оттуда же экспортировали (exports)):

const sequelize = require('../server/db')

//*И теперь только необходимо вызвать функцию для подключения к БД:

const start = async () => {  // создадим функцию, обязательно async, т.к. все операции с БД...!
  try {
    await sequelize.authenticate() // с ее помощью и устанавливается подключение к БД
    await sequelize.sync() // эта фун-ция сверяет состояние БД со схемой данных (которую напишем позже)
    app.listen(PORT, () => console.log(`Server started..! on port ${PORT}`))
  } catch (e) {
    console.log(e);
  }
}

start(); // не забываем вызвать!

       //* Следующим этапом будет построение диаграммы БД https://clck.ru/T3MHn 
       //* (https://app.diagrams.net/)
  
Одна таблица для одной сущности. Название таблицы (начнем с описания сущности пользователя - user). У каждой сущности обязательно должен быть id. ...Описание всех таблиц...

 //* В folder Server создаем folder models -> в ней file *models.js*. Здесь и будем описывать модели данных. Import sequelize:

const sequelize = require('../db');
const { DataTypes } = require('sequelize'); //из самого пакета sequelize импортируем класс DataTypes, с помощью которого описываются типы того или иного поля: STRING, INTEGER т.д.

     //* И начнем описывать модели:

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
});  // здесь будет всего одно поле с id. Остальные поля, т.е. внешние ключи (primaryKey) sequelize добавит сам, когда мы вызываем функции (belongsToMany), sequelize будет все внешние ключи добавлять автоматически.

     //* А теперь настал момент описать того, как эти модели связаны друг с другом! Делается это таким образом:
//обращаемся к модели и вызываем соответствующую функцию - hasMany или hasOne - НАПРИМЕР:
Device.hasMany(DeviceInfo) //так мы говорим, что одна запись Device в БД содержит МНОго записей с характеристиками
DeviceInfo.belongsTo(Device) //  указываем для DeviceInfo, что эта сущность принадлежит Device

      //* ..но пойдем по порядку. Начнем с пользователя:

//? User.hasOne(Basket) //связь м\у User(пользователем) и Basket(корзиной) один к одному
//? Basket.belongsTo(User) //говорим, что Basket(корзина) принадлежит User(пользователю)

//? User.hasMany(Rating) // один User(пользователь) может иметь несколько оценок
//? Rating.belongsTo(User) // для Rating говорим, что принадлежит User(пользователю)

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

Device.hasMany(DeviceInfo); //так мы говорим, что одна запись Device в БД содержит МНОго записей с характеристиками
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

    //* Далее возвращаемся в файл index.js, сюда все модели импортируем:
const models = require('./models/models') 
// видим в логах кучу!! сообщений Это как раз запросы к БД, чтобы создать те или иные модели!
//! БД создана!

// * --> идем дальше в файл index.js, настроим cors, чтобы мы могли отправлять запросы с браузера. чтобы наш бэкенд разрешал запросы с разных IP-адресов



  
//? ниже это из другого урока..

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

*!! то всё успешно подключено!*
Больше эта функция не нужна, комментим либо удаляем.

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

  **Models, Migration**
** создаем БД, владелец admin:
postgres=# CREATE DATABASE pets2 OWNER admin;
CREATE DATABASE
 ** даем полные права
postgres=# GRANT ALL PRIVILEGES ON DATABASE pets2 TO admin;
GRANT
 и выходим отсюда \q в обычный терминал
БД создана, её название можем прописать в наш код соединения с БД (указан выше).

 *С настройками закончено. Проверить настройки пока не можем, т.к. нет models, migrations

 *** Дальше.. models, migrations создаются вместе. Почему: models - это класс, в котором есть все свойства, которые есть в таблице, а migrations - это сама структура таблиц. Все столбцы, которые прописаны в migrations, создаются в реальной БД. И т.к. они должны содержать одинаковый набор полей, они создаются вместе! ПОЭТОМУ, если что-то вручную поме- няли в models, то нужно вручную менять и в migrations!
 - Итак: 
 *** models - это class, такая виртуальная составляющая, а 
 *** migrations - это физическая структура БД.
 
 !** Вызов справки-подсказки команд:   npx sequelize 
 
  *** Дальше команда, которая создает models и migrations:
    (*** ! сама таблица наз-ся с маленькой буквы во множественном числе, а model, т.е. class, который с ней взаимодействует - с большой БУквы и в единственном числе!)
  
npx sequelize-cli model:generate .... жмем, если забыли команды, появится другая подсказка,
там на нужны только две команды (справа указаны "необходимо"):
--name             Defines the name of the new 
--attributes       A list of attributes  

 *** Для создания модели через CLI используется команда model:generate У этой команды
 есть две обязательные опции:
 name - название модели с БОЛьшой буквы в ЕДИнственном числе
 attributes  - список атрибутов и их типы, пишутся без пробелов
 
npx sequelize-cli model:generate --name Human --attributes (a дальше без пробелов) name:string,age:integer
** Всё! Создали и models и migrations. Рассмотрим их...

 **migrations*: 
 id создается автоматически и с ПРАВильными настройками:
 id: {
        allowNull: false,     // нельзя НЕ заполнить, т.е. оставить пустым нельзя!
        autoIncrement: true,
        primaryKey: true,    // он же первичный ключ
        type: Sequelize.INTEGER,
      },

 **models*: 
 index.js создается автоматически, служит для того, чтобы нам было удобно экспортировать все эти модели их папки models. Он делает .readdirSync(__dirname). Он экспортирует все модели, которые есть внутри этой папки models.
 human.js - так выглядит модель. Видим, что сразу же экспортируется. Создаем новый class Human, он будет расширять extends Model (class Human extends Model)

  static associate(models) {
     // если нужно будет связывать модели, пишем в этом методе associate
    }

 *** И, как говорили, должны быть одинаковые колонки и в models , и в migrations!!!
 
  ** models **
  
 name: DataTypes.STRING,
 age: DataTypes.INTEGER,
 
   ** migrations**
   
  name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
  age: {
        type: Sequelize.INTEGER,
      },

***Миграции**
Файлы миграций - это файлы, которые содержат в себе изменения структуры БД.
Миграции создаются вместе с моделями автоматически и лежат в папке migrations
Для того чтобы применить миграции и актуализировать состояние структуры БД необходимо выполнить команду:   
  *** И теперь накатываем миграции (команда заставляет миграции примениться к БД):
  npx sequelize-cli db:migrate
  
 Важно! Если вы вносили изменения в модель после создания, то необходимо продублировать это в файле миграции для этой модели.


***Откат миграций (Отменить старую миграцию)**
 Отменить все миграции можно следующей командой:
npx sequelize-cli db:migrate:undo:all  (лучше, на всякий случай :all)
 
 Если необходимо откатиться на какое-то определенное состояние, используйте  флаг --to
и название конкретной миграции:

npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
 например:
npx sequelize-cli db:migrate:undo:all --to 20230328204117-create-human.js
 
  **!Если что-то поменяли в миграции, то нужно откатить и накатить заново!*
  Потому что миграции - это есть отражение физической структуры БД
 **А в модели можем менять и не перенакатывать, т.к. это просто виртуальное представление, это просто class. Можно сказать, модель - это просто JavaScript, он к самой БД отношения не имеет, просто позволяет удобно, с помощью методов взаимодействовать с табличкой.


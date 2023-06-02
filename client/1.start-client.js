// Переходим к созданию Frontend-а -> клиентской части приложения. Переходим in folder Client -> там разворачиваем React-приложение.
//* cd .. - так переходим на один уровень вверх
//* cd client - так переходим в папку client
//* npx create-react-app . - не забудем ТОЧку!
// точка означает, что устанавливаем в ТЕКУЩую! папку

//* Удаляем ненужные файлы, подчистим и оставим App.js, index.js

//* Установим необходимые зависимости
// axios - отправки запросов на сервер
// react-router-dom - для постраничной навигации
// mobx - State manager
// mobx-react-lite - связать mobx с функциональными компонентами React-а
//* npm i axios react-router-dom mobx mobx-react-lite

// также будем использовать bootstrap
//* npm i react-bootstrap bootstrap

// и возьмем стили, скачаем с https://react-bootstrap.github.io/getting-started/introduction
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
  integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
  crossorigin="anonymous"
/>


//? почистим самый главный корневой файл -> index.html ->  ИТОГО:

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
      crossorigin="anonymous"
/>
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

//*     Теперь перейдем в App.js - это будет основным компонентом нашего приложения!
// Здесь напишем между <div > WORKING </div> -ов что-нить для проверки -> и запустим:
//* npm start
//? Браузер сам открылся, надпись видна, всё работает! PORT default: 3000!

//*    Теперь зададим структуру приложения, создадим все папки, которые в дальнейшем нам понадобятся. В src -> create folders:
//?- store - там мы будем взаимодействовать с mobx и хранить какие-то данные
//?- pages - там будут корневые компоненты, которые будут являться страницами
//?- components - там будут всякие navbar и всё в таком духе

//*  И начнем создавать страницы. snippet *rafce*
// - Auth.js  - В папке pages создаем страницу с авторизацией - файл Auth.js В нем набираем сниппет *rafce* и компонент развернется (стрелочный )!
// - Shop.js - то же... Это будет основная страница, там будут карточки с устройствами, постраничный вывод, список брендов и т.д.
// - DevicePage.js - страница, когда мы откроем конкретное устройство (Device), а там будут написаны характеристики, возможность добавить в корзину
// - Admin.js - админ панель. Там администратор будет добавлять Type, Brand, Device
// - Basket.js - реализовывать не будет, это будет домашним заданием

//*     Теперь все страницы известны. Можем организовать навигацию по ним.
//Для этого в папке components создадим новым компонент AppRouter.js В нем будет написана логика навигации по страницам. На какие-то страницы сможе зайти любой человек, а на какие-то только авторизованный. В нем помимо *rafce* импортим еще:
import {Routes, Route, Navigate} from 'react-router-dom' 
//? это изменение произощло после выпуска видео

// затем в App.js вместо <div> импортим и оборачиваем в <BrowserRouter>. И сюда добавляем  <AppRouter />, который мы сами сделали.
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';

const App = () => {
  return (
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
  );
};

export default App;

//*  Следующим этапом в папке src -> создаем файлик, который назовем routes.js
// в нем будут описаны все маршруты к конкретным страницам, которые есть в приложении
// добавляем в него два массива

export const authRoutes = [] - // в нем будет список маршрутов только для тех страниц, к которым имеет доступ авторизованный пользователь
export const publicRoutes = [] - // на эти маршруты может перейти любой пользователь
// Сразу экспортим оба эти массива, и в него добавляем объект
import Admin from './pages/Admin'

export const authRoutes = [
  {
    path: '/admin', //путь, ссылка по которму будет работать страница
    Component: Admin // это уже сама страница
    // в данном случае по upl '/admin' будет вызываться компонент Admin
  }
]

export const publicRoutes = []

//* Но вот так в виде строки указывать маршрут является не очень хорошей практикой. Представьте, у вас 20 страниц ->  есть вложенные подстраницы... Будет путаница. Для этого создадим в папке - src -> папку utils и в ней -> файлик consts.js (с константами). Отсюда будем экспортить константы, например ADMIN_ROUTE= '/admin' - внутри указываем путь до этой папки. В дальнейшем мы можем эти константы просто экспортировать и использовать в нужных местах, не боясь ошибиться в том или ином маршруте. Создаем по такой константе для каждой страницы. 
export const ADMIN_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const REGISTRATION_ROUTE = '/registration'
export const SHOP_ROUTE = '/'
export const BASKET_ROUTE = '/basket'
export const DEVICE_ROUTE = '/device'

// -> возвращаемся в файлик routes.js и теперь путь передаем как константу

import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from './utils/consts'
import Admin from './pages/Admin'
import Basket from './pages/Basket'
import Shop from './pages/Shop'
import Auth from './pages/Auth'
import DevicePage from './pages/DevicePage'


export const authRoutes = [
  //эти страницы будут доступны только авторизованным пользователям
  // именно поэтому мы сделали отдельный массив
  {
    path: ADMIN_ROUTE,
    Component: Admin
  },
  {
    path: BASKET_ROUTE,
    Component: Basket
  },
]

export const publicRoutes = [
  // a эти роуты для публичных страниц (не авторизованных)
  {
    path: SHOP_ROUTE,
    Component: Shop
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth
  },
  {
    path: DEVICE_ROUTE + '/:id',
    Component: DevicePage
  },
]

//маршруты описали, но на данном этапе они работать не будут, их необходимо оживить. Переходим в AppRouter.js

import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes'
import { SHOP_ROUTE } from '../utils/consts'

const AppRouter = () => {
  const isAuth = false
  return (
    <Routes>
    {isAuth && authRoutes.map(({path, Component}) =>
      <Route key={path} path={path} element={<Component/>} exact/>
    )}
    {publicRoutes.map(({path, Component}) =>
    <Route key={path} path={path} element={<Component/>} exact/>
    )}
    <Route path='*' element={<Navigate to={SHOP_ROUTE} />} />
  </Routes>
  )
}

export default AppRouter;

//* теперь разберемся с переменной const isAuth = false. Она нам понадобится в нескольких компонентах, поэтому вынесем ее в отдельное глобальное хранилище. В folder store -> create file UserStore.js -> сейчас будем работать уже с mobx

import { makeAutoObservable } from "mobx"

export default class UserStore {
  constructor() {
    //нижнее подчеркивание означает, что эта переменная изменяться не может
    this._isAuth = false
    this._user = {}
    makeAutoObservable(this)
  }

  setIsAuth(bool) {
    this._isAuth = bool
  }
  setUser(user) {
    this._user = user
  }

  get isAuth() {
    return this._isAuth
  }
  get user() {
    return this._user
  }
}

//* Теперь разберемся с тем, как это состояние прокидывать в наши компоненты. Переходим in folder utils -> file index.js Здесь воспользуемся  context-ом React-а. Он создается с помощью ф-ции createContext(). Не забываем его имортировать из from 'react'. И теперь у этого Context есть компонент Provider, в него оборачиваем наше приложение и <App /> помещаем в середину/ А в props value= передадим данные. В нашем случае передадим туда объект {user: new UserStore()}, который мы сделали

const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore()
    }}>
        <App />
    </Context.Provider>
    
);

//* теперь откроем AppRouter.js и попробуем переменную const isAuth из этого store получить:

import React, { useContext } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes'
import { SHOP_ROUTE } from '../utils/consts'
import { Context } from '../index'

const AppRouter = () => {
  const {user} = useContext(Context)

  console.log(user);

  return (
    <Routes>
    {user.isAuth && authRoutes.map(({path, Component}) =>
      <Route key={path} path={path} element={<Component/>} exact/>
    )}
    {publicRoutes.map(({path, Component}) =>
    <Route key={path} path={path} element={<Component/>} exact/>
    )}
    <Route path='*' element={<Navigate to={SHOP_ROUTE} />} />
  </Routes>
  )
}

export default AppRouter

//* У нас есть теперь глобальное хранилище и в любом месте нашего приложения мы можем получать из него данные!
// Сразу создадим второй store: in folder store -> create file DeviceStore.js - >

import { makeAutoObservable } from "mobx"

export default class DeviceStore {
  constructor() {
    //нижнее подчеркивание означает, что эта переменная изменяться не может
    //* пока не научились делать запросы к серверу захардкодим пару объектов
    //*чтобы было удобно верстать
    this._types = [
      {id: 1, name: 'Холодильники'},
      {id: 2, name: 'Смартфоны'}
    ]
    //* тоже самое
    this._bramds =[
      {id: 1, name: 'Samsung'},
      {id: 2, name: 'Apple'},
    ]
     //* тоже самое
      this.devices =[
      {id: 1, name: 'Iphone 12 pro', price: 25000, rating: 5, img: '0edac1f1-766c-4490-9e8e-5dcc81fcb13f.jpg'},
      {id: 2, name: 'Iphone 12 pro', price: 25000, rating: 5, img: '0edac1f1-766c-4490-9e8e-5dcc81fcb13f.jpg'},
      {id: 3, name: 'Iphone 12 pro', price: 25000, rating: 5, img: ''},
      {id: 4, name: 'Iphone 12 pro', price: 25000, rating: 5, img: ''},
    ]

    makeAutoObservable(this)
  }

  setTypes(types) {
    this._types = types
  }
  setBrands(brands) {
    this._brands = brands
  }
  setDevices(devices) {
    this._devices = devices
  }

  get types() {
    return this._types
  }
  get brands() {
    return this._brands
  }
  get devices() {
    return this._devices
  }
}

// Теперь вернемся in folder utils -> file index.js и добавим DeviceStore()

import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        device: new DeviceStore()
    }}>
        <App />
    </Context.Provider>
    
);

// В принципе, каркас приложения готов, можно приступить к верстке
https://www.figma.com/file/nutWUOANZdJ7gnBazQBLie/Untitled?type=design&node-id=1-157
//! 1 h 24 min

//* переходим in folder client -> folder src -> folder components -> create file NavBar.js
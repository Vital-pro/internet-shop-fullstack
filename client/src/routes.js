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
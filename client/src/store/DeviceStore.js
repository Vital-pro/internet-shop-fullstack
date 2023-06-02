//* У нас есть теперь глобальное хранилище и в любом месте нашего приложения мы можем получать из него данные!
// Сразу создадим второй store: in folder store -> create file DeviceStore.js - >

import { makeAutoObservable } from "mobx"

export default class DeviceStore {
  // constructor будет вызываться при создании оюъекта данного class
  constructor() {
    //нижнее подчеркивание означает, что эта переменная изменяться не может
    //* пока не научились делать запросы к серверу захардкодим пару объектов
    //*чтобы было удобно верстать Объекты в массивах полностью соответствуют тем, что описаны в моделях на backend
    this._types = [
      {id: 1, name: 'Холодильники'},
      {id: 2, name: 'Смартфоны'}
    ]
    //* тоже самое
    this._brands =[
      {id: 1, name: 'Samsung'},
      {id: 2, name: 'Apple'},
    ]
     //* тоже самое
     this._devices =[
      {id: 1, name: 'Iphone 12 pro', price: 25000, rating: 5, img: '0edac1f1-766c-4490-9e8e-5dcc81fcb13f.jpg'},
      {id: 2, name: 'Iphone 12 pro', price: 25000, rating: 5, img: '0edac1f1-766c-4490-9e8e-5dcc81fcb13f.jpg'},
      {id: 3, name: 'Iphone 12 pro', price: 25000, rating: 5, img: ''},
      {id: 4, name: 'Iphone 12 pro', price: 25000, rating: 5, img: ''},
    ]

    makeAutoObservable(this)
  }

  //* далее по известной схеме создаем action-ы и присваиваем соответствующим переменным соответствующие значения

  setTypes(types) {
    this._types = types
  }
  setBrands(brands) {
    this._brands = brands
  }
  setDevices(devices) {
    this._devices = devices
  }

  //* и для каждой переменной делаем get-теры

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
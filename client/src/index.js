import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
// import 'bootstrap/dist/css/bootstrap.min.css';


//* Теперь разберемся с тем, как это состояние прокидывать в наши компоненты. Переходим in folder utils -> file index.js Здесь воспользуемся  context-ом React-а. Он создается с помощью ф-ции createContext(). Не забываем его имортировать из from 'react'. И теперь у этого Context есть компонент Provider, в него оборачиваем наше приложение и <App /> помещаем в середину/ А в props value= передадим данные. В нашем случае передадим туда объект {user: new UserStore()}, который мы сделали

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

// теперь откроем AppRouter.js и попробуем переменную const isAuth из этого store получить ->

// В принципе, каркас приложения готов, можно приступить к верстке



//! 1 h 24 min
// В принципе, каркас приложения готов, можно приступить к верстке
https://www.figma.com/file/nutWUOANZdJ7gnBazQBLie/Untitled?type=design&node-id=1-157
// используем https://react-bootstrap.github.io/components/navbar/

//* переходим in folder client -> folder src -> folder components -> create file NavBar.js
// snippet *rafce* -> create component NavBar

import React, { useContext } from 'react'
import { Context } from '../index'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { SHOP_ROUTE } from '../utils/consts'
import { observer } from 'mobx-react-lite'

const NavBar = observer(() => {
  // сразу получим user store их Context, т.к., в зависимости от того,  авторизован он или нет, NavBar будет отображаться по разному 
  const {user} = useContext(Context)
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
     <NavLink style={{color:'white'}} to={SHOP_ROUTE}>КупиДевайс</NavLink>
      { user.isAuth ?
       <Nav className="mr-auto" style={{color: 'white', marginLeft: 'auto'}}>
       <Button variant={'outline-light'}>Админ панель</Button>
       <Button variant={'outline-light'} style={{ marginLeft: '15px'}}>Войти</Button>
      </Nav>
      :
      <Nav className="mr-auto" style={{color: 'white', marginLeft: 'auto'}}>
      <Button variant={'outline-light'} onClick={()=> user.setIsAuth(true)}>Авторизация</Button>
     </Nav>
      }
      </Container>
  </Navbar>
  )
})

export default NavBar

// затем перейдем в компоненту utils -> App.js и там над <AppRouter /> добавим наш <NavBar />. Он будет отображаться на каждой странице

//* теперь откроем макет и приступим к форме авторизации и регистрации
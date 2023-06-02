import React from 'react'
import { Card, Container, Form } from 'react-bootstrap'

const Auth = () => {
  return (
    <Container 
    className='d-flex justify-content-center align-items-center'
    style={{height: window.innerHeight - 54}}
    >
      <Card>
        <Form>

        </Form>
      </Card>
AUTH
    </Container>
  )
}

export default Auth

//* теперь откроем макет и приступим к форме авторизации и регистрации. Для этого уже есть созданный компонент pages -> Auth.js. И мы сделаем его универсальным: как под авторизацию, так и под регистрацию

//! 1 h 29 min
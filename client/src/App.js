import React from 'react'
import { observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Store from './store/store'

const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Добро пожаловать</h1>
            {Store.isAuth ? <h2>Вы уже вошли</h2> : (
              <div>
                <LoginForm />
                <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
              </div>
            )}
          </div>
        } />
        <Route path="/register" element={
          <div>
            <h1>Регистрация</h1>
            <RegisterForm />
            <p>Уже есть аккаунт? <a href="/">Войти</a></p>
          </div>
        } />
      </Routes>
    </Router>
  )
})

export default App
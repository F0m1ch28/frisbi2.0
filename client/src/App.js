import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import HomePage from './components/HomePage'
import { useStore } from './store/store'

const App = observer(() => {
  const { store } = useStore()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [store])

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            store.isAuth ? (
              <HomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <div className="container">
              <h1>Вход</h1>
              <LoginForm />
              <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
              </p>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="container">
              <h1>Регистрация</h1>
              <RegisterForm />
              <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
              </p>
            </div>
          }
        />
      </Routes>
    </Router>
  )
})

export default App
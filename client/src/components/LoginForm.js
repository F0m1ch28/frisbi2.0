import React, { useState, useEffect } from 'react'
import { useStore } from '../store/store'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const { store } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await store.login(email, password)
      console.log('Успешный логин:', response)
      navigate('/')
    } catch (error) {
      console.error('Ошибка при логине:', error.response?.data?.message || error.message)
      if (error.response?.data?.message === 'Email пользователя не был активирован') {
        setIsEmailNotVerified(true)
      } else {
        setError('Ошибка входа: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  useEffect(() => {
    if (store.isAuth) {
      navigate('/')
    }
  }, [store.isAuth, navigate])

  const handleVerification = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await store.verifyEmail(email, verificationCode)
      console.log('Email успешно подтвержден')
      setIsEmailNotVerified(false)
      navigate('/')
    } catch (error) {
      setError('Ошибка подтверждения email: ' + error.message)
    }
  }

  return (
    <form onSubmit={isEmailNotVerified ? handleVerification : handleLogin}>
      {error && <div className="error">{error}</div>}
      {isEmailNotVerified ? (
        <>
          <p>Ваш email не подтвержден. Введите код подтверждения</p>
          <input
            type="text"
            placeholder="Код подтверждения"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Подтвердить email</button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Войти</button>
        </>
      )}
    </form>
  )
}

export default LoginForm

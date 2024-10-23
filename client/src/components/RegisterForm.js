import React, { useContext, useState } from 'react'
import { StoreContext } from '../store/store'
import { useNavigate } from 'react-router-dom'

const RegisterForm = () => {
  const { store } = useContext(StoreContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) {
      setError('поля username, email и password обязательны')
      return;
    }

    try {
      await store.registration(username, email, password)
      setError('')
      setIsRegistered(true)
    } catch (error) {
      setError('Ошибка регистрации: ' + error.message)
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    try {
      await store.verifyEmail(email, verificationCode, password)
      setError('')
      console.log('Email успешно подтвержден')
      navigate('/')
    } catch (error) {
      setError('Ошибка подтверждения email: ' + error.message)
    }
  }

  return (
    <form onSubmit={isRegistered ? handleVerification : handleSubmit}>
      {isRegistered ? (
        <>
          <p>Введите код подтверждения, отправленный на вашу почту</p>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Подтвердить email</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default RegisterForm
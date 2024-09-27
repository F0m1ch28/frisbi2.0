import React, { useContext, useState } from 'react'
import { StoreContext } from '../store/store'

const RegisterForm = () => {
  const { store } = useContext(StoreContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) {
      setError('поля username, email и password обязательны')
      return
    }

    try {
      await store.registration(username, email, password)
      console.log('Регистрация прошла успешно')
      setError('')
    } catch (error) {
      setError('Ошибка регистрации: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default RegisterForm
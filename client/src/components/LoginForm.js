import React, { useState } from 'react'
import AuthService from '../services/AuthService'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.token)
      alert('Login successful')
    } catch (error) {
      setError('Login failed: ' + error.response.data.message || error.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
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
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default LoginForm
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Chat from './Chat'
import { useStore } from '../store/store'

const HomePage = () => {
  const { store } = useStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await store.logout()
    navigate('/login')
  }

  return (
    <div className="container">
      <header>
        <h1>Добро пожаловать, {store.user.email}</h1>
        <button onClick={handleLogout}>Выйти</button>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  )
}

export default HomePage
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Chat from './Chat'
import Statistics from './Statistics'
import Recommendations from './Recommendations'
import Rating from './Rating'
import { useStore } from '../store/store'

const HomePage = () => {
  const { store } = useStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await store.logout()
    navigate('/login')
  }

  useEffect(() => {
    store.loadAllData()
  }, [store])

  return (
    <div className="container">
      <header className="home-header">
        <h1>Добро пожаловать, {store.user?.email || 'Гость'}</h1>
        <button onClick={handleLogout}>Выйти</button>
      </header>
      <main className="home-container">
        <Statistics />
        <Recommendations />
        <Rating />
        <Chat />
      </main>
    </div>
  )
}

export default HomePage

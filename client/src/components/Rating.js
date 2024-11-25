import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'

const Rating = observer(() => {
  const { store } = useStore()

  useEffect(() => {
    store.fetchRating()
  }, [store])

  if (store.isDataLoading) {
    return (
      <div className="home-section">
        <h2>Рейтинг</h2>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  if (store.dataError) {
    return (
      <div className="home-section">
        <h2>Рейтинг</h2>
        <p>{store.dataError}</p>
      </div>
    )
  }

  return (
    <div className="home-section">
      <h2>Рейтинг</h2>
      <div className="rating-list">
        {store.rating.map((user, index) => (
          <div className="rating-card" key={index}>
            <div className="rating-rank">{index + 1}</div>
            <div className="rating-info">
              <span className="rating-user">{user.user}</span>
              <span className="rating-points">{user.points} баллов</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default Rating

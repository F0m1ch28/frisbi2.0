import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'

const Statistics = observer(() => {
  const { store } = useStore()

  useEffect(() => {
    store.fetchStatistics()
  }, [store])

  if (store.isDataLoading) {
    return (
      <div className="home-section">
        <h2>Статистика</h2>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  if (store.dataError) {
    return (
      <div className="home-section">
        <h2>Статистика</h2>
        <p>{store.dataError}</p>
      </div>
    )
  }

  const { lessonsCompleted, tasksSolved, examsCompleted, hoursSpent } = store.statistics || {}

  return (
    <div className="home-section">
      <h2>Статистика</h2>
      <div className="statistics-grid">
        <div className="stat-item">
          <span className="stat-title">Завершено уроков</span>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(lessonsCompleted / 20) * 100}%` }}
            ></div>
          </div>
          <span className="stat-value">{lessonsCompleted}/20</span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Решено задач</span>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(tasksSolved / 50) * 100}%` }}
            ></div>
          </div>
          <span className="stat-value">{tasksSolved}/50</span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Решено пробников</span>
          <span className="stat-value">{examsCompleted}</span>
        </div>
        <div className="stat-item">
          <span className="stat-title">Потрачено часов</span>
          <span className="stat-value">{hoursSpent} ч.</span>
        </div>
      </div>
    </div>
  )
})

export default Statistics

import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/store'

const Recommendations = observer(() => {
  const { store } = useStore()

  useEffect(() => {
    store.fetchRecommendations()
  }, [store])

  if (store.isDataLoading) {
    return (
      <div className="home-section">
        <h2>Рекомендуемые темы</h2>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  if (store.dataError) {
    return (
      <div className="home-section">
        <h2>Рекомендуемые темы</h2>
        <p>{store.dataError}</p>
      </div>
    )
  }

  return (
    <div className="home-section">
      <h2>Рекомендуем к изучению сегодня:</h2>
      <div className="recommendations-grid">
        {store.recommendations.map((topic, index) => (
          <div className="recommendation-card" key={index}>
            <h3 className="recommendation-title">{topic.title}</h3>
            <p className="recommendation-description">{topic.description}</p>
            <div className="subtopics-grid">
              {topic.subTopics.map((subTopic, subIndex) => (
                <button className="subtopic-button" key={subIndex}>
                  {subTopic.title} <span>{subTopic.duration} мин.</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default Recommendations

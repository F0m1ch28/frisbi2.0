export const mockStatistics = {
  lessonsCompleted: 12,
  tasksSolved: 34,
  hoursSpent: 8,
  examsCompleted: 9
}

export const mockRecommendations = [
  {
    title: 'Русский язык задание 2',
    description: 'Подготовка к экзамену',
    subTopics: [
      { title: 'Тема 1', duration: '~25 мин' },
      { title: 'Тема 2', duration: '~15 мин' },
      { title: 'Тема 3', duration: '~35 мин' }
    ]
  },
  {
    title: 'Математика задание 3',
    description: 'Закрепление материала',
    subTopics: [
      { title: 'Тема 1', duration: '~30 мин' },
      { title: 'Тема 2', duration: '~20 мин' }
    ]
  },
  {
    title: 'История задание 1',
    description: 'Краткий обзор событий',
    subTopics: [
      { title: 'Тема 1', duration: '~40 мин' }
    ]
  }
]

export const mockRating = [
  { user: 'user1@example.com', points: 120 },
  { user: 'user2@example.com', points: 110 },
  { user: 'user3@example.com', points: 90 }
]

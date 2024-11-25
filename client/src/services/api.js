import axios from 'axios'
import { mockStatistics, mockRecommendations, mockRating } from '../mocks/mockData'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const fetchData = async (endpoint, fallback) => {
  try {
    const response = await api.get(endpoint)
    return response.data
  } catch (error) {
    console.warn(`Ошибка загрузки данных с ${endpoint}:`, error.message)
    return fallback
  }
}

export const fetchStatistics = () => fetchData('/statistics', mockStatistics)
export const fetchRecommendations = () => fetchData('/recommendations', mockRecommendations)
export const fetchRating = () => fetchData('/rating', mockRating)

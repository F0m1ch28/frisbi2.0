import React from 'react'
import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import $api from '../http'
import { fetchStatistics, fetchRecommendations, fetchRating } from '../services/api'

class Store {
  user = null
  isAuth = false
  isLoading = false
  isVerified = false
  statistics = null
  recommendations = []
  rating = []
  isDataLoading = false
  dataError = null

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(isAuth) {
    this.isAuth = isAuth
  }

  setUser(user) {
    this.user = user
  }

  setLoading(isLoading) {
    this.isLoading = isLoading
  }

  setVerified(isVerified) {
    this.isVerified = isVerified
  }

  setStatistics(statistics) {
    this.statistics = statistics
  }

  setRecommendations(recommendations) {
    this.recommendations = recommendations
  }

  setRating(rating) {
    this.rating = rating
  }

  setDataLoading(isLoading) {
    this.isDataLoading = isLoading
  }

  setDataError(error) {
    this.dataError = error
  }

  async fetchStatistics() {
    this.setDataLoading(true)
    try {
      const data = await fetchStatistics()
      this.setStatistics(data)
    } catch (e) {
      console.error('Ошибка загрузки статистики:', e.message)
      this.setDataError('Ошибка загрузки статистики')
    } finally {
      this.setDataLoading(false)
    }
  }

  async fetchRecommendations() {
    this.setDataLoading(true)
    try {
      const data = await fetchRecommendations()
      this.setRecommendations(data)
    } catch (e) {
      console.error('Ошибка загрузки рекомендаций:', e.message)
      this.setDataError('Ошибка загрузки рекомендаций')
    } finally {
      this.setDataLoading(false)
    }
  }

  async fetchRating() {
    this.setDataLoading(true)
    try {
      const data = await fetchRating()
      this.setRating(data)
    } catch (e) {
      console.error('Ошибка загрузки рейтинга:', e.message)
      this.setDataError('Ошибка загрузки рейтинга')
    } finally {
      this.setDataLoading(false)
    }
  }

  async loadAllData() {
    this.setDataLoading(true)
    try {
      await Promise.all([
        this.fetchStatistics(),
        this.fetchRecommendations(),
        this.fetchRating()
      ])
    } catch (e) {
      console.error('Ошибка загрузки данных:', e.message)
      this.setDataError('Ошибка загрузки данных')
    } finally {
      this.setDataLoading(false)
    }
  }

  async registration(username, email, password) {
    try {
      const response = await AuthService.registration(username, email, password)
      this.setUser(response.user)
      this.setVerified(false)
      return response
    } catch (e) {
      console.error(e?.response?.data?.message || 'registration error')
      throw new Error(e?.response?.data?.message || 'registration error')
    }
  }

  async verifyEmail(email, emailVerificationCode, password) {
    try {
      const response = await AuthService.verifyEmail(email, emailVerificationCode, password)
      this.setVerified(true)
      this.setAuth(true)
      localStorage.setItem('token', response.token)
      this.setUser(response.user)
      return response
    } catch (e) {
      console.error(e?.response?.data?.message || 'verification error')
      throw new Error(e?.response?.data?.message || 'verification error')
    }
  }

  async login(email, password) {
    this.setLoading(true)
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.token)
      this.setAuth(true)
      this.setUser(response.user)
      return response
    } catch (e) {
      console.error(e?.response?.data?.message || 'login error')
      throw new Error(e?.response?.data?.message || 'login error')
    } finally {
      this.setLoading(false)
    }
  }

  async logout() {
    try {
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser(null)
    } catch (e) {
      console.error(e?.response?.data?.message || 'logout error')
      this.setAuth(false)
      this.setUser(null)
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await $api.get('/api/auth/check', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        this.setAuth(true)
        this.setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
      } else {
        this.setAuth(false)
        this.setUser(null)
      }
    } catch (e) {
      console.error(e?.response?.data?.message || 'auth check error')
      this.setAuth(false)
      this.setUser(null)
      localStorage.removeItem('token')
    } finally {
      this.setLoading(false)
    }
  }
}

const store = new Store()
export const StoreContext = React.createContext({ store })
export const useStore = () => React.useContext(StoreContext)

export default store
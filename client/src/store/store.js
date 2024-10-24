import React from 'react'
import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { API_URL } from '../http'
import AuthResponse from '../models/response/AuthResponse'

class Store {
  user = null
  isAuth = false
  isLoading = false
  isVerified = false

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

  async verifyEmail(email, emailVerificationCode) {
    try {
      const response = await AuthService.verifyEmail(email, emailVerificationCode)
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
      console.log('Логин успешен, данные:', response)

      const authResponse = new AuthResponse(response.token, response.user)
      localStorage.setItem('token', authResponse.token)
      this.setAuth(true)
      this.setUser(authResponse.user)
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
        const response = await axios.get(`${API_URL}/api/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const authResponse = new AuthResponse(response.data.token, response.data.user)
        localStorage.setItem('token', authResponse.token)
        this.setAuth(true)
        this.setUser(authResponse.user)
      } else {
        this.setAuth(false)
        this.setUser(null)
      }
    } catch (e) {
      console.error(e?.response?.data?.message || 'auth check error')
      this.setAuth(false)
      this.setUser(null)
    } finally {
      this.setLoading(false)
    }
  }
}

const store = new Store()
export const StoreContext = React.createContext({ store })

export const useStore = () => React.useContext(StoreContext)

export default store
import $api from '../http/index'

class AuthService {
  static async registration(username, email, password) {
    const response = await $api.post('/api/auth/register', {
      username,
      email,
      password,
    })
    return response.data
  }

  static async login(email, password) {
    try {
      const response = await $api.post('/api/auth/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Ошибка при логине:', error.response?.data?.message || error.message)
      throw error
    }
  }

  static async verifyEmail(email, emailVerificationCode, password) {
    const response = await $api.post('/api/auth/verify-email', {
      email,
      email_verification_code: emailVerificationCode,
      password,
    })
    return response.data
  }

  static async logout() {
    const response = await $api.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    return response.data
  }
}

export default AuthService

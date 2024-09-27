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
    const response = await $api.post('/api/auth/login', {
      email,
      password,
    })
    return response.data
  }

  static async logout() {
    const response = await $api.post('/api/auth/logout')
    return response.data
  }
}

export default AuthService
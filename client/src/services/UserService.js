import $api from '../http'

class UserService {
  async getUser() {
    const response = await $api.get('/user')
    return response.data
  }
}

export default new UserService()
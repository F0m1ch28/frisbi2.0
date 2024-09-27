import IUser from '../IUser'

export default class AuthResponse {
  constructor(token, user) {
    this.token = token
    this.user = new IUser(user.id, user.username, user.email)
  }
}
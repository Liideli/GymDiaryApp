const login = `
mutation Login($credentials: Credentials!) {
    login(credentials: $credentials) {
      message
      token
      user {
        email
        id
        user_name
      }
    }
  }
  `;

const register = `
mutation Register($user: UserInput!) {
  register(user: $user) {
    user {
      user_name
      email
      id
    }
  }
}`;

export { login, register };
export const login = user => {
  return {
    type: 'USER_LOGGED_IN',
    payload: user
  }
}

export const logout = user => {
  return {
    type: 'USER_LOGGED_OUT',
  }
}
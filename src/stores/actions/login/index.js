export const SET_IS_LOGIN = 'login/SET_IS_LOGIN'

export const setIsLogin = (payload) => (dispatch) => {
  dispatch({
    type: SET_IS_LOGIN,
    payload,
  })
}

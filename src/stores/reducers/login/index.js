import { SET_IS_LOGIN } from 'src/stores/actions/login'

const initialState = {
  isLogin: false,
}

const loginReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_IS_LOGIN:
      return {
        ...state,
        isLogin: payload,
      }
    default:
      return state
  }
}

export default loginReducer

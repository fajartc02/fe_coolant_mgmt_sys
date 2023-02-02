import { SIDEBAR_TOGGLE } from '../../actions'
const initialState = {
  sidebarShow: true,
}

const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case SIDEBAR_TOGGLE:
      return {
        ...state,
        sidebarShow: payload,
      }
    default:
      return state
  }
}

export default changeState

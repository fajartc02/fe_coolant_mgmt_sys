import { SET_THEME } from 'src/stores/actions/uiGeneral'
import { DARK_THEME } from 'src/utils/helpers'

const initialState = {
  theme: DARK_THEME,
}

const uiGeneralReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_THEME:
      return {
        ...state,
        theme: payload,
      }
    default:
      return state
  }
}

export default uiGeneralReducer

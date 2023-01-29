import { SET_SELECTED_MACHINE } from '../../actions/machine'

const initialState = {
  selectedMachine: {},
}

const machineReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_MACHINE:
      return {
        ...state,
        selectedMachine: payload,
      }
    default:
      return state
  }
}

export default machineReducer

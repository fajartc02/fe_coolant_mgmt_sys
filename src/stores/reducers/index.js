/* eslint-disable import/no-anonymous-default-export */
import { combineReducers } from 'redux'
import loginReducer from './login'
import machineReducer from './machine'
import changeState from './sidebar'
import uiGeneralReducer from './uiGeneral'

export default () =>
  combineReducers({
    loginReducer,
    machineReducer,
    changeState,
    uiGeneralReducer,
  })

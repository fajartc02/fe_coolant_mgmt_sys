/* eslint-disable import/no-anonymous-default-export */
import { combineReducers } from 'redux'
import loginReducer from './login'
import machineReducer from './machine'

export default () =>
  combineReducers({
    loginReducer,
    machineReducer,
  })

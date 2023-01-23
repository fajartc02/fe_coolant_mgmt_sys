/* eslint-disable import/no-anonymous-default-export */
import { combineReducers } from 'redux'
import loginReducer from './login'

export default () =>
  combineReducers({
    loginReducer,
  })

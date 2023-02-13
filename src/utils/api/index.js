import axios from 'axios'

const apiUrlProduction = ''
const apiUrlDev = 'http://localhost:3100/api/v1'
const apiUrl = process.env.NODE_ENV === 'production' ? apiUrlProduction : apiUrlDev

export const postLogin = (payload) => axios.post(`${apiUrl}/login`, payload).then((res) => res.data)

export const postRegister = (payload) =>
  axios.post(`${apiUrl}/register`, payload).then((res) => res.data)

export const getPublicGroup = () => axios.get(`${apiUrl}/public/group`).then((res) => res.data)

export const getLinesMap = (param) => axios.get(`${apiUrl}/operational/dashboard/linesMap/${param}`)
export const getMachineStatusMap = (param) =>
  axios.get(`${apiUrl}/operational/dashboard/machinesStatusMap/${param}`)

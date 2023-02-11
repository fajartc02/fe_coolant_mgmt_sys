import axios from 'axios'

const apiUrlProduction = ''
const apiUrlDev = 'http://localhost:3100/api/v1'
const apiUrl = process.env.NODE_ENV === 'production' ? apiUrlProduction : apiUrlDev

export const postLogin = (payload) => axios.post(`${apiUrl}/login`, payload).then((res) => res.data)

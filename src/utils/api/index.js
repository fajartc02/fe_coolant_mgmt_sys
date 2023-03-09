import axios from 'axios'
import QS from 'qs'

const apiUrlProduction = ''
const apiUrlDev = 'http://localhost:3100/api/v1'
const apiUrl = process.env.NODE_ENV === 'production' ? apiUrlProduction : apiUrlDev

export const postLogin = (payload) => axios.post(`${apiUrl}/login`, payload).then((res) => res.data)

export const postRegister = (payload) =>
  axios.post(`${apiUrl}/register`, payload).then((res) => res.data)

export const getPublicGroup = () => axios.get(`${apiUrl}/public/group`).then((res) => res.data)

export const getLinesMap = (param) => axios.get(`${apiUrl}/operational/dashboard/linesMap/${param}`)

export const getMachineStatusMap = (machine_id, startDate, endDate) =>
  axios.get(`${apiUrl}/operational/dashboard/machinesStatusMap/${machine_id}`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
    paramsSerializer: {
      serialize: (params) => QS.stringify(params, { encode: false }),
    },
  })

export const getLinesSummaries = () => axios.get(`${apiUrl}/operational/dashboard/linesSummaries`)

export const getCheckSheet = (machine_id) =>
  axios.get(`${apiUrl}/operational/checksheet/check/machine/${machine_id}`)

export const getMaintenanceMachineCheck = (machine_id, startDate, endDate) =>
  axios.get(`${apiUrl}/operational/maintenance/machine/${machine_id}`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
    paramsSerializer: {
      serialize: (params) => QS.stringify(params, { encode: false }),
    },
  })

export const getMaintenanceMachineCS = (machine_id, periodic_check_id) =>
  axios.get(`${apiUrl}/operational/maintenance/machine/checksheet/${periodic_check_id}`, {
    params: {
      machine_id: machine_id,
    },
  })

export const getUsersGroup = () => axios.get(`${apiUrl}/master/users/group`)

export const getMachineScheduleList = (machine_id, checksheet_id) =>
  axios.get(`${apiUrl}/master/maintenance/schedules`, {
    params: {
      'tmm.machine_id': machine_id,
      'tmcs.checksheet_id': checksheet_id,
    },
  })

export const getLinesMaster = () => axios.get(`${apiUrl}/master/lines`)

export const getCheckSheetAfterChanges = (machine_id, periodic_check_id, checksheet_id) =>
  axios.get(`${apiUrl}/operational/maintenance/machine/task`, {
    params: {
      machine_id,
      periodic_check_id,
      checksheet_id,
    },
  })

export const getCostGraph = (start, end) =>
  axios.get(`${apiUrl}/operational/cost/graph`, {
    params: {
      start,
      end,
    },
  })

export const postChemicalChanges = (payload) =>
  axios.post(`${apiUrl}/operational/maintenance/machine/chemicals`, payload)

export const postCheckSheet = (payload) =>
  axios.post(`${apiUrl}/operational/maintenance/machine/checksheet`, payload)

export const postChemicalChangesCheck = (payload) =>
  axios.post(`${apiUrl}/operational/maintenance/machine/chemicals/check`, payload)

export const postChemicalChangesEvalParam = (payload) =>
  axios.post(`${apiUrl}/operational/maintenance/machine/parameters/evaluate`, payload)

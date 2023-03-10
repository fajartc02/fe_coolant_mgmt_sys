import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { toast } from 'react-toastify'
import {
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import { DrainingForm, MainForm, CheckingForm, EvaluationForm } from 'src/components'

// API
import {
  getMaintenanceMachineCS,
  getUsersGroup,
  getMachineScheduleList,
  getCheckSheetAfterChanges,
  postChemicalChanges,
  postChemicalChangesCheck,
  postChemicalChangesEvalParam,
} from 'src/utils/api'

moment.locale('id')

const parameters = [
  { name: 'Visual', code: 'VS' },
  { name: 'Sludge', code: 'SL' },
  { name: 'Konsentrasi', code: 'KS' },
  { name: 'PH', code: 'PH' },
]

const generateColor = (rule_id) => {
  if (rule_id === 2) {
    return '#00ff90'
  } else if (rule_id === 3) {
    return '#ffbb00'
  } else {
    return '#ff3f00'
  }
}

const afterCheck = [
  {
    task_id: 110,
    task_value: null,
    task_status: null,
    periodic_check_id: 425,
    created_by: '1629083',
    created_dt: '2023-03-05T09:15:04.000Z',
    changed_by: '1629083',
    changed_dt: '2023-03-05T09:15:04.000Z',
    option_id: 4,
    param_id: 4,
    rule_id: 4,
    img: null,
  },
  {
    task_id: 111,
    task_value: null,
    task_status: null,
    periodic_check_id: 425,
    created_by: '1629083',
    created_dt: '2023-03-05T09:15:04.000Z',
    changed_by: '1629083',
    changed_dt: '2023-03-05T09:15:04.000Z',
    option_id: 7,
    param_id: 8,
    rule_id: 4,
    img: null,
  },
  {
    task_id: 112,
    task_value: null,
    task_status: null,
    periodic_check_id: 425,
    created_by: '1629083',
    created_dt: '2023-03-05T09:15:04.000Z',
    changed_by: '1629083',
    changed_dt: '2023-03-05T09:15:04.000Z',
    option_id: 6,
    param_id: 5,
    rule_id: 2,
    img: null,
  },
  {
    task_id: 113,
    task_value: 1,
    task_status: 'NG',
    periodic_check_id: 425,
    created_by: '1629083',
    created_dt: '2023-03-05T09:15:04.000Z',
    changed_by: '1629083',
    changed_dt: '2023-03-05T09:15:04.000Z',
    option_id: 11,
    param_id: 7,
    rule_id: 2,
    img: null,
  },
  {
    task_id: 114,
    task_value: 1,
    task_status: 'NG',
    periodic_check_id: 425,
    created_by: '1629083',
    created_dt: '2023-03-05T09:15:04.000Z',
    changed_by: '1629083',
    changed_dt: '2023-03-05T09:15:04.000Z',
    option_id: 10,
    param_id: 6,
    rule_id: 2,
    img: null,
  },
]

const generateDefaultFilledCheckSheet = (parameters, param_id) => {
  let final = ''
  parameters.forEach((element) => {
    if (element.param_id === param_id) {
      if (param_id === 4 || param_id === 8) {
        const result = element.options.filter((el) => el.selected_opt)
        final = result?.[0]?.option_id
      } else if (param_id === 6 || param_id === 7) {
        final = element?.options?.[0]?.task_value
      } else if (param_id === 5) {
        const result = element.options.filter((el) => el.selected_opt)[0]
        if (result.option_id === 6) {
          final = false
        } else {
          final = true
        }
      }
    }
  })

  return final
}
const generateDefaultFilledEvaluateSheet = (parameters, param_id) => {
  let value = ''
  parameters.forEach((element) => {
    if (element.param_id === param_id) {
      if (param_id === 4 || param_id === 8) {
        value = element.children[0].option_id
      } else if (param_id === 6 || param_id === 7) {
        value = element.children[0].task_value
      } else if (param_id === 5) {
        return false
        // const result = element.options.filter((el) => el.selected_opt)[0]
        // if (result.option_id === 6) {
        //   value = false
        // } else {
        //   value = true
        // }
      }
    }
  })

  return value
}

const generateOOSParam = (payload) => {
  const array = []

  payload.forEach((el) =>
    array.push({
      code: el.param_id,
      param_id: el.param_id,
      param_nm: el.param_nm,
      name: el.param_nm,
    }),
  )

  return array
}

const Draining = () => {
  const navigate = useNavigate()
  let { machine_id, periodic_check_id } = useParams()

  // ====== USESTATE

  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [parameterMaster, setParameterMaster] = useState([])
  const [parameterTaskId, setParameterTaskId] = useState([])
  const [selectedChecksitId, setSelectedChecksitId] = useState('')
  const [selectedIndexDynamicField, setSelectedIndexDynamicField] = useState(0)
  const [outOfStandardParam, setOutOfStandardParam] = useState([])

  // const [isSubmitCheckingForm, setIsSubmitCheckingForm] = useState(false)
  const [startDate, setStartDate] = useState({
    value: new Date(),
    isError: false,
    errorMessage: '',
  })
  const [startTime, setStartTime] = useState({
    value: new Date(),
    isError: false,
    errorMessage: '',
  })
  const [endDate, setEndDate] = useState({
    value: new Date(),
    isError: false,
    errorMessage: '',
  })
  const [endTime, setEndTime] = useState({
    value: new Date().getTime() + 1 * 60 * 1000,
    isError: false,
    errorMessage: '',
  })
  const [openModal, setOpenModal] = useState({
    show: false,
    type: '',
  })
  const [dynamicFields, setDynamicFields] = useState([])

  // ====== END OF USESTATE

  // START USEQUERY

  const { data: userGroup } = useQuery(['users-group'], () => getUsersGroup(), {
    refetchOnWindowFocus: false,
    select: ({ data }) => {
      return data.data
    },
    onSuccess: (data) => {
      setSelectedEmployee(data[0])
    },
    onError: (data) => {
      toast.error(data.message)
    },
  })

  const { refetch: refetchMachineScheduleList } = useQuery(
    ['machine-schedule-list'],
    () => getMachineScheduleList(machine_id, 'notnull'),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        let duplicate = [...dynamicFields]
        const newDynamicField = {
          id: new Date().getTime(),
          type: 'checking',
          isActive: true,
          fields: [
            {
              // id: new Date().getTime(),
              Visual: {
                value: '',
                param: {},
              },
              Sludge: {
                value: '',
                param: {},
              },
              isStink: {
                value: false,
                param: {},
              },
              PH: {
                value: '',
                isError: false,
                errorMessage: '',
                param: {},
              },
              Konsentrasi: {
                value: '',
                isError: false,
                errorMessage: '',
                param: {},
              },
            },
          ],
          checkingMaintenanceList: [...data],
          selectedCheckMaintenance: '',
          paramRender: [],
        }

        duplicate.push(newDynamicField)

        setDynamicFields(duplicate)
      },
    },
  )

  const { data: maintenanceData } = useQuery(
    ['check-sheet', machine_id, periodic_check_id],
    () => getMaintenanceMachineCS(machine_id, periodic_check_id),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        console.log('========')
        console.log(JSON.stringify(data, null, '\t'))
        let duplicate = [...dynamicFields]
        if (data.start_date !== null) {
          // && data.chemical_check.length !== 0
          const payload = [
            {
              id: new Date().getTime(),
              type: 'draining',
              isActive: false,
              isFilled: true,
              reason: '',
              fields: [
                {
                  id: new Date().getTime(),
                  parameter: [],
                  listCairan: [...data.chemical_changes],
                  cairan: {
                    tipeCairan: '',
                    totalCairan: 0,
                    biaya: 0,
                  },
                  isError: false,
                  errorMessage: '',
                  isErrorParameter: false,
                  errorMessageParameter: '',
                  reason: '',
                },
              ],
            },
          ]

          if (data.chemical_check.length !== 0) {
            payload.push({
              id: new Date().getTime(),
              type: 'checking',
              isActive: false,
              isFilled: true,
              fields: [
                {
                  // id: new Date().getTime(),
                  Visual: {
                    value: generateDefaultFilledCheckSheet(data.chemical_check[0].parameters, 4),
                    param: {},
                  },
                  Sludge: {
                    value: generateDefaultFilledCheckSheet(data.chemical_check[0].parameters, 8),
                    param: {},
                  },
                  isStink: {
                    value: generateDefaultFilledCheckSheet(data.chemical_check[0].parameters, 5),
                    param: {},
                  },
                  PH: {
                    value: generateDefaultFilledCheckSheet(data.chemical_check[0].parameters, 7),
                    isError: false,
                    errorMessage: '',
                    param: {},
                  },
                  Konsentrasi: {
                    value: generateDefaultFilledCheckSheet(data.chemical_check[0].parameters, 6),
                    isError: false,
                    errorMessage: '',
                    param: {},
                  },
                },
              ],
              checkingMaintenanceList: [],
              selectedCheckMaintenance: '',
              paramRender: [
                {
                  parameters: data.chemical_check[0].parameters,
                },
              ],
            })
          }

          if (data.parameter_evaluate.chemical_changes.length !== 0) {
            payload.push({
              id: new Date().getTime(),
              type: 'evaluation',
              isActive: false,
              isFilled: true,
              reason: data?.notes,
              fields: [
                {
                  id: new Date().getTime(),
                  oosParam: generateOOSParam(data.parameter_evaluate.param_check),
                  parameter: {
                    value: [],
                    isErrorParameter: false,
                    errorMessageParameter: '',
                  },
                  listCairan: {
                    value: [...data.parameter_evaluate.chemical_changes],
                    isError: false,
                    errorMessage: '',
                  },
                  cairan: {
                    tipeCairan: '',
                    totalCairan: 0,
                    biaya: 0,
                  },
                  Visual: {
                    value: generateDefaultFilledEvaluateSheet(
                      data.parameter_evaluate.param_check,
                      4,
                    ),
                    param: {},
                  },
                  Sludge: {
                    value: generateDefaultFilledEvaluateSheet(
                      data.parameter_evaluate.param_check,
                      8,
                    ),
                    param: {},
                  },
                  isStink: {
                    value: generateDefaultFilledEvaluateSheet(
                      data.parameter_evaluate.param_check,
                      5,
                    ),
                    param: {},
                  },
                  PH: {
                    value: generateDefaultFilledEvaluateSheet(
                      data.parameter_evaluate.param_check,
                      7,
                    ),
                    isError: false,
                    errorMessage: '',
                    param: {},
                  },
                  Konsentrasi: {
                    value: generateDefaultFilledEvaluateSheet(
                      data.parameter_evaluate.param_check,
                      6,
                    ),
                    isError: false,
                    errorMessage: '',
                    param: {},
                  },
                },
              ],
              paramRender: [
                {
                  parameters: data.chemical_check[0].parameters,
                },
              ],
            })
          }

          setDynamicFields([...duplicate, ...payload])
        } else {
          const payload = {
            id: new Date().getTime(),
            type: 'draining',
            isActive: true,
            reason: '',
            fields: [
              {
                id: new Date().getTime(),
                parameter: [],
                listCairan: [],
                cairan: {
                  tipeCairan: '',
                  totalCairan: 0,
                  biaya: 0,
                },
                isError: false,
                errorMessage: '',
                isErrorParameter: false,
                errorMessageParameter: '',
                reason: '',
              },
            ],
          }

          duplicate.push(payload)
          setDynamicFields(duplicate)
        }
      },
    },
  )

  const { refetch: refetchCheckSheetAfterChanges } = useQuery(
    ['check-sheet-after-changes', machine_id, periodic_check_id],
    () => getCheckSheetAfterChanges(machine_id, periodic_check_id, selectedChecksitId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        let duplicate = [...dynamicFields]
        data?.[0]?.parameters?.forEach((param) => {
          if (param.param_nm === 'Visual') {
            duplicate[selectedIndexDynamicField].fields[0].Visual.param = {
              ...param.options[0],
              ...param,
            }
          }
          if (param.param_nm === 'Sludge') {
            duplicate[selectedIndexDynamicField].fields[0].Sludge.param = {
              ...param.options[0],
              ...param,
            }
          }
          if (param.param_nm === 'Aroma') {
            let temp = param.options.filter((el) => el.option_id === 6)[0]
            duplicate[selectedIndexDynamicField].fields[0].isStink.param = { ...temp, ...param }
          }
        })

        const newDynamicField = {
          ...dynamicFields[selectedIndexDynamicField],
          paramRender: [...data],
        }

        duplicate[selectedIndexDynamicField] = newDynamicField

        setParameterMaster(data)

        setDynamicFields(duplicate)
      },
    },
  )

  const { mutate } = useMutation(postChemicalChanges, {
    onSuccess: ({ data }) => {
      let duplicate = [...dynamicFields]
      setOpenModal({
        show: true,
        type: 'draining',
      })
      duplicate[selectedIndexDynamicField].isActive = false
      setDynamicFields(duplicate)
    },
    onError: ({ response }) => {
      toast.error(response.data.message)
    },
  })
  const { mutate: mutateChemicalChangesCheck } = useMutation(postChemicalChangesCheck, {
    onSuccess: ({ data }) => {
      console.log(
        JSON.stringify(data.data.rows, null, '\t'),
        'ini sukses data mutateChemicalChangesCheck',
      )
      setParameterTaskId(data.data.rows)
      let duplicate = [...dynamicFields]

      // after check dapet disin
      setOpenModal({
        show: true,
        type: 'checking',
      })
      duplicate[selectedIndexDynamicField].isActive = false
      setDynamicFields(duplicate)
    },
    onError: ({ response }) => {
      toast.error(response.data.message)
    },
  })
  const { mutate: mutateChemicalChangesEvalParam } = useMutation(postChemicalChangesEvalParam, {
    onSuccess: ({ data }) => {
      console.log(data, '===== ini dia reulsttt')
      let duplicate = [...dynamicFields]

      duplicate[selectedIndexDynamicField].isActive = false
      setDynamicFields(duplicate)
      setOpenModal({
        show: true,
        type: 'finish',
      })
    },
    onError: (error) => {
      console.log(error, '----')
      toast.error(error.message)
    },
  })

  // END USEQUERY

  // ====== START CHECKING FORM

  const handleSubmitCheckingFormValidation = (indexDynamicFields) => {
    let isPassValidation = true
    let duplicate = [...dynamicFields]
    if (!duplicate[indexDynamicFields].fields[0].PH.value) {
      duplicate[indexDynamicFields].fields[0].PH.isError = true
      duplicate[indexDynamicFields].fields[0].PH.errorMessage = 'PH harus diisi'
      isPassValidation = false
    }
    if (!duplicate[indexDynamicFields].fields[0].Sludge.value) {
      duplicate[indexDynamicFields].fields[0].Sludge.isError = true
      duplicate[indexDynamicFields].fields[0].Sludge.errorMessage = 'Sludge harus diisi'
      isPassValidation = false
    }
    if (!duplicate[indexDynamicFields].fields[0].Visual.value) {
      duplicate[indexDynamicFields].fields[0].Visual.isError = true
      duplicate[indexDynamicFields].fields[0].Visual.errorMessage = 'Visual harus diisi'
      isPassValidation = false
    }

    if (!duplicate[indexDynamicFields].fields[0].Konsentrasi.value) {
      duplicate[indexDynamicFields].fields[0].Konsentrasi.isError = true
      duplicate[indexDynamicFields].fields[0].Konsentrasi.errorMessage = 'Konsentrasi harus diisi'
      isPassValidation = false
    }

    setDynamicFields(duplicate)

    return isPassValidation
  }

  const handleSubmitCheckingForm = (indexDynamicFields) => {
    const isPassValidation = handleSubmitCheckingFormValidation(indexDynamicFields)
    let duplicate = [...dynamicFields]
    if (isPassValidation) {
      const phData = duplicate[indexDynamicFields].fields[0].PH
      const konsentrasiData = duplicate[indexDynamicFields].fields[0].Konsentrasi
      const visualData = duplicate[indexDynamicFields].fields[0].Visual
      const sludgeData = duplicate[indexDynamicFields].fields[0].Sludge
      const isStinkData = duplicate[indexDynamicFields].fields[0].isStink

      const payload = {
        periodic_check_id: Number(periodic_check_id),
        checksheet_id: Number(selectedChecksitId),
        parameters_check: [
          {
            periodic_check_id: Number(periodic_check_id),
            param_id: visualData.param.param_id,
            option_id: visualData.param.option_id,
            rule_id: visualData.param.rule_id,
            task_status: null,
            task_value: null,
          },
          {
            periodic_check_id: Number(periodic_check_id),
            param_id: sludgeData.param.param_id,
            option_id: sludgeData.param.option_id,
            rule_id: sludgeData.param.rule_id,
            task_status: null,
            task_value: null,
          },
          {
            periodic_check_id: Number(periodic_check_id),
            param_id: isStinkData.param.param_id,
            option_id: isStinkData.param.option_id,
            rule_id: isStinkData.param.rule_id,
            task_value: null,
            task_status: null,
          },
          {
            periodic_check_id: Number(periodic_check_id),
            param_id: phData?.param?.param_id,
            option_id: phData?.param?.option_id,
            rule_id: phData?.param?.rule_id,

            task_status:
              Number(phData.value) >= Number(phData?.param?.min_value) &&
              Number(phData.value) <= Number(phData?.param?.max_value)
                ? 'OK'
                : 'NG',
            task_value: Number(phData.value),
          },
          {
            periodic_check_id: Number(periodic_check_id),
            param_id: konsentrasiData?.param?.param_id,
            option_id: konsentrasiData?.param?.option_id,
            rule_id: konsentrasiData?.param?.rule_id,

            task_status:
              Number(konsentrasiData.value) >= Number(konsentrasiData?.param?.min_value) &&
              Number(konsentrasiData.value) <= Number(konsentrasiData?.param?.max_value)
                ? 'OK'
                : 'NG',
            task_value: Number(konsentrasiData.value),
          },
        ],
      }

      let arrayHead = Object.keys(duplicate[indexDynamicFields].fields[0])
      let temp = duplicate[indexDynamicFields].fields[0]
      const oosParam = []
      const arrayParam = []
      arrayHead.forEach((key) => {
        if (
          (temp[key].param.param_id === 4 && temp[key].param.rule_lvl > 1) ||
          (temp[key].param.param_id === 8 && temp[key].param.rule_lvl > 1)
        ) {
          oosParam.push({
            param_id: temp[key].param.param_id,
            param_nm: temp[key].param.param_nm,
            code: temp[key].param.param_id,
            name: temp[key].param.param_nm,
          })
        } else if (
          (temp[key].param.param_id === 6 &&
            (Number(temp[key].value) > temp[key].param.max_value ||
              Number(temp[key].value) < temp[key].param.min_value)) ||
          (temp[key].param.param_id === 7 &&
            (Number(temp[key].value) > temp[key].param.max_value ||
              Number(temp[key].value) < temp[key].param.min_value))
        ) {
          oosParam.push({
            param_id: temp[key].param.param_id,
            param_nm: temp[key].param.param_nm,
            code: temp[key].param.param_id,
            name: temp[key].param.param_nm,
          })
        }

        arrayParam.push({
          rule_lvl: temp[key].param.rule_lvl,
          rule_id: temp[key].param.rule_id,
          param_id: temp[key].param.param_id,
        })
      })

      setOutOfStandardParam(oosParam)
      let sortedPeaks = arrayParam.sort((a, b) => b.rule_lvl - a.rule_lvl)

      // let duplicate = [...dynamicFields]

      // let newDynamicFields = {
      //   id: new Date().getTime(),
      //   type: 'evaluation',
      //   isActive: true,
      //   reason: '',
      //   fields: [
      //     {
      //       id: new Date().getTime(),
      //       oosParam: [...oosParam],
      //       parameter: {
      //         value: [],
      //         isErrorParameter: false,
      //         errorMessageParameter: '',
      //       },
      //       listCairan: {
      //         value: [],
      //         isError: false,
      //         errorMessage: '',
      //       },
      //       cairan: {
      //         tipeCairan: '',
      //         totalCairan: 0,
      //         biaya: 0,
      //       },
      //       Visual: {
      //         value: '',
      //         param: {},
      //         isError: false,
      //         errorMessage: '',
      //       },
      //       Sludge: {
      //         value: '',
      //         param: {},
      //         isError: false,
      //         errorMessage: '',
      //       },
      //       isStink: {
      //         value: false,
      //         param: {},
      //         isError: false,
      //         errorMessage: '',
      //       },
      //       PH: {
      //         value: '',
      //         isError: false,
      //         errorMessage: '',
      //         param: {},
      //       },
      //       Konsentrasi: {
      //         value: '',
      //         isError: false,
      //         errorMessage: '',
      //         param: {},
      //       },
      //     },
      //   ],
      //   paramRender: [...parameterMaster],
      // }
      // duplicate.push(newDynamicFields)
      // setDynamicFields(duplicate)

      const newPayload = {
        ...payload,
        rule_id: sortedPeaks[0].rule_id,
        color_status: generateColor(sortedPeaks[0].rule_id),
      }

      mutateChemicalChangesCheck(newPayload)
      duplicate[indexDynamicFields].isActive = false
      setDynamicFields(duplicate)
    }
  }

  const handleOnFocusFormChecking = (indexDynamicFields, fieldName) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[0][fieldName].isError = false
    duplicate[indexDynamicFields].fields[0][fieldName].errorMessage = ''

    setDynamicFields(duplicate)
  }

  const handleOnChangeFormChecking = (indexDynamicFields, e, param) => {
    let duplicate = [...dynamicFields]

    setSelectedIndexDynamicField(indexDynamicFields)
    if (e.target.name === 'checkingMaintenanceList') {
      duplicate[indexDynamicFields].selectedCheckMaintenance = e.target.value
      setSelectedChecksitId(e.target.value)
    } else if (e.target.name === 'Visual1') {
      duplicate[indexDynamicFields].fields[0].Visual.isError = false
      duplicate[indexDynamicFields].fields[0].Visual.errorMessage = ''
      duplicate[indexDynamicFields].fields[0].Visual.value = Number(e.target.value)
      duplicate[indexDynamicFields].fields[0].Visual.param = param
    } else if (e.target.name === 'Sludge1') {
      duplicate[indexDynamicFields].fields[0].Sludge.isError = false
      duplicate[indexDynamicFields].fields[0].Sludge.errorMessage = ''
      duplicate[indexDynamicFields].fields[0].Sludge.value = Number(e.target.value)
      duplicate[indexDynamicFields].fields[0].Sludge.param = param
    } else if (e.target.name === 'isStink') {
      duplicate[indexDynamicFields].fields[0][e.target.name].value = e.target.checked
      duplicate[indexDynamicFields].fields[0][e.target.name].param = param
    } else {
      duplicate[indexDynamicFields].fields[0][e.target.name].value = e.target.value.replace(
        /[^0-9.]/g,
        '',
      )
      duplicate[indexDynamicFields].fields[0][e.target.name].param = param
    }

    setDynamicFields(duplicate)
  }
  // ====== END CHECKING FORM

  // ====== START OF DRAINING FORM ======

  const validationDrainingForm = (indexDynamicFields) => {
    let isPassValidation = true

    if (indexDynamicFields === 0) {
      if (!startDate.value) {
        setStartDate({
          ...startDate,
          isError: true,
          errorMessage: 'Start Date harus diisi',
        })
        isPassValidation = false
      }

      if (!startTime.value) {
        setStartTime({
          ...startTime,
          isError: true,
          errorMessage: 'Start Time harus diisi',
        })
        isPassValidation = false
      }

      if (!endDate.value) {
        setEndDate({
          ...endDate,
          isError: true,
          errorMessage: 'End Date harus diisi',
        })
        isPassValidation = false
      }

      if (!endTime.value) {
        setEndTime({
          ...endTime,
          isError: true,
          errorMessage: 'End Time harus diisi',
        })
        isPassValidation = false
      }
    }

    if (indexDynamicFields !== 0) {
      const emptyParameter = dynamicFields[indexDynamicFields].fields.findIndex(
        (el) => el.parameter.length === 0,
      )

      if (emptyParameter !== -1) {
        let duplicate = [...dynamicFields]
        dynamicFields[indexDynamicFields].fields.forEach((element, idx) => {
          if (element.parameter.length === 0) {
            duplicate[indexDynamicFields].fields[idx].isErrorParameter = true
            duplicate[indexDynamicFields].fields[idx].errorMessageParameter = 'Parameter harus disi'
          }
        })
        setDynamicFields(duplicate)
        isPassValidation = false
      }
    }

    const emptyLiquidIndex = dynamicFields[indexDynamicFields].fields.findIndex(
      (el) => el.listCairan.length === 0,
    )

    if (emptyLiquidIndex !== -1) {
      let duplicate = [...dynamicFields]
      dynamicFields[indexDynamicFields].fields.forEach((element, idx) => {
        if (element.listCairan.length === 0) {
          duplicate[indexDynamicFields].fields[idx].isError = true
          duplicate[indexDynamicFields].fields[idx].errorMessage = 'Penambahan cairan kosong'
        }
      })
      setDynamicFields(duplicate)
      isPassValidation = false
    }

    return isPassValidation
  }

  const printTipeCairan = (id) => {
    const filtered = maintenanceData?.chemicals?.filter((el) => el.chemical_id === Number(id))[0]

    return filtered?.chemical_nm
  }

  const handleAddingLiquid = (indexDynamicFields, indexFields) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].isError = false
    duplicate[indexDynamicFields].fields[indexFields].errorMessage = ''

    const newData = {
      id: new Date().getTime(),
      tipeCairan: duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan,
      totalCairan: duplicate[indexDynamicFields].fields[indexFields].cairan.totalCairan,
      biaya: duplicate[indexDynamicFields].fields[indexFields].cairan.biaya,
      isEdit: false,
    }

    duplicate[indexDynamicFields].fields[indexFields].listCairan.push(newData)
    duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan = ''
    duplicate[indexDynamicFields].fields[indexFields].cairan.totalCairan = 0
    duplicate[indexDynamicFields].fields[indexFields].cairan.biaya = 0
    setDynamicFields(duplicate)
  }

  const handleEditLiquid = (indexDynamicFields, indexFields, indexCairan) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].listCairan[indexCairan].isEdit = true
    setDynamicFields(duplicate)
  }

  const handleEditLiquidDone = (indexDynamicFields, indexFields, indexCairan) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].listCairan[indexCairan].isEdit = false
    setDynamicFields(duplicate)
  }

  const handleChangeFormDraining = (indexDynamicFields, indexFields, event, additionalName) => {
    let data = [...dynamicFields]
    setSelectedIndexDynamicField(indexDynamicFields)
    if (data[indexDynamicFields].type === 'draining') {
      if (additionalName === 'parameter') {
        data[indexDynamicFields].fields[indexFields].parameter = event.value
        data[indexDynamicFields].fields[indexFields].isErrorParameter = false
        data[indexDynamicFields].fields[indexFields].errorMessageParameter = ''
      } else if (event.target.name === 'reason') {
        data[indexDynamicFields].reason = event.target.value
      } else {
        data[indexDynamicFields].fields[indexFields].cairan[event.target.name] = event.target.value
        if (event.target.name === 'totalCairan') {
          const filtered = maintenanceData?.chemicals?.filter(
            (el) =>
              el.chemical_id ===
              Number(data[indexDynamicFields].fields[indexFields].cairan.tipeCairan),
          )[0]

          data[indexDynamicFields].fields[indexFields].cairan.biaya =
            Number(filtered.price_per_liter) * Number(event.target.value)
        }
      }
    }
    setDynamicFields(data)
  }

  const handleEditFormDraining = (indexDynamicFields, indexFields, indexCairan, event) => {
    let data = [...dynamicFields]

    data[indexDynamicFields].fields[indexFields].listCairan[indexCairan][event.target.name] =
      event.target.value
    const filtered = maintenanceData?.chemicals?.filter(
      (el) =>
        el.chemical_id ===
        Number(data[indexDynamicFields].fields[indexFields].listCairan[indexCairan].tipeCairan),
    )[0]

    if (event.target.name === 'totalCairan') {
      data[indexDynamicFields].fields[indexFields].listCairan[indexCairan].biaya =
        Number(filtered.price_per_liter) * Number(event.target.value)
    } else {
      data[indexDynamicFields].fields[indexFields].listCairan[indexCairan].biaya =
        Number(filtered.price_per_liter) *
        Number(data[indexDynamicFields].fields[indexFields].listCairan[indexCairan].totalCairan)
    }
    setDynamicFields(data)
  }

  const handleDeleteDrainingField = (indexDynamicFields, indexFields) => {
    let duplicate = [...dynamicFields]
    if (duplicate[indexDynamicFields].fields.length === 1) return

    duplicate[indexDynamicFields].fields.splice(
      duplicate[indexDynamicFields].fields.findIndex((el) => el.id === indexFields),
      1,
    )
    setDynamicFields(duplicate)
  }

  const addDrainingFields = (indexDynamicFields) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields.push({
      id: new Date().getTime(),
      parameter: '',
      listCairan: [],
      cairan: {
        tipeCairan: '',
        totalCairan: 0,
        biaya: 0,
      },
    })
    setDynamicFields(duplicate)
  }

  const handleDelete = (indexDynamicFields, indexFields, idListCairan) => {
    let duplicate = [...dynamicFields]

    duplicate[indexDynamicFields].fields[indexFields].listCairan.splice(
      duplicate[indexDynamicFields].fields[indexFields].listCairan.findIndex(
        (el) => el.id === idListCairan,
      ),
      1,
    )
    setDynamicFields(duplicate)
  }

  const handleSubmitDrainingForm = (indexDynamicFields) => {
    const isPassValidation = validationDrainingForm(indexDynamicFields)
    let duplicate = [...dynamicFields]
    let mainFormReq = {}
    let drainingRequest = []

    if (indexDynamicFields === 0) {
      mainFormReq = {
        periodic_check_id: Number(periodic_check_id),
        start_date: `${moment(startDate.value).format('YYYY-MM-DD')} ${moment(
          startTime.value,
        ).format('HH:mm:00')}`,
        finish_date: `${moment(endDate.value).format('YYYY-MM-DD')} ${moment(endTime.value).format(
          'HH:mm:00',
        )}`,
        pic: selectedEmployee.user_id,
        group_id: selectedEmployee.group_id,
      }
    }

    duplicate[indexDynamicFields].fields.forEach((field) => {
      drainingRequest = field.listCairan.map((cairan) => ({
        chemical_id: Number(cairan.tipeCairan),
        vol_changes: Number(cairan.totalCairan),
        cost_chemical: Number(cairan.biaya),
        periodic_check_id: Number(periodic_check_id),
      }))
    })

    if (isPassValidation) {
      mutate({
        ...mainFormReq,
        chemicals: drainingRequest,
      })
    }
  }

  // ====== END OF DRAINING FORM

  // ====== ====== GENERAL ====== ======

  const handleOnConfirmModal = () => {
    let newDynamicFields = {}
    let duplicate = [...dynamicFields]
    if (openModal.type === 'draining') {
      refetchMachineScheduleList()
    } else {
      newDynamicFields = {
        id: new Date().getTime(),
        type: 'evaluation',
        isActive: true,
        reason: '',
        fields: [
          {
            id: new Date().getTime(),
            oosParam: [...outOfStandardParam],
            parameter: {
              value: [],
              isErrorParameter: false,
              errorMessageParameter: '',
            },
            listCairan: {
              value: [],
              isError: false,
              errorMessage: '',
            },
            cairan: {
              tipeCairan: '',
              totalCairan: 0,
              biaya: 0,
            },
            Visual: {
              value: '',
              param: {},
            },
            Sludge: {
              value: '',
              param: {},
            },
            isStink: {
              value: false,
              param: {},
            },
            PH: {
              value: '',
              isError: false,
              errorMessage: '',
              param: {},
            },
            Konsentrasi: {
              value: '',
              isError: false,
              errorMessage: '',
              param: {},
            },
          },
        ],
        paramRender: [...parameterMaster],
      }
      duplicate.push(newDynamicFields)
      setDynamicFields(duplicate)
    }

    setOpenModal({
      show: false,
      type: '',
    })
  }

  const handleSelectEmployee = (e) => {
    const filterEmployee = userGroup?.filter((el) => el.user_id === Number(e.target.value))[0]
    setSelectedEmployee(filterEmployee)
  }

  // ====== ====== END GENERAL ====== ======

  const handleChangeFormEvaluation = (
    indexDynamicFields,
    indexFields,
    e,
    additionalName,
    param,
  ) => {
    let duplicate = [...dynamicFields]
    if (additionalName === 'parameter') {
      duplicate[indexDynamicFields].fields[indexFields].parameter.value = e.value
      duplicate[indexDynamicFields].fields[indexFields].parameter.isErrorParameter = false
      duplicate[indexDynamicFields].fields[indexFields].parameter.errorMessageParameter = ''
    } else if (e.target.name === 'PH' || e.target.name === 'Konsentrasi') {
      console.log('masmasma')
      console.log(e.target.name)
      console.log(e.target.value)
      duplicate[indexDynamicFields].fields[0][e.target.name].isError = false
      duplicate[indexDynamicFields].fields[0][e.target.name].errorMessage = ''
      duplicate[indexDynamicFields].fields[0][e.target.name].value = e.target.value.replace(
        /[^0-9.]/g,
        '',
      )

      const paramWithTaskId = parameterTaskId.filter(
        (e) => Number(e.param_id) === Number(param.param_id),
      )[0]
      duplicate[indexDynamicFields].fields[0][e.target.name].param = {
        ...param,
        task_id: paramWithTaskId?.task_id,
      }
    } else if (e.target.name === 'Sludge' || e.target.name === 'Visual') {
      duplicate[indexDynamicFields].fields[0][e.target.name].isError = false
      duplicate[indexDynamicFields].fields[0][e.target.name].errorMessage = ''
      duplicate[indexDynamicFields].fields[0][e.target.name].value = Number(e.target.value)

      const paramWithTaskId = parameterTaskId.filter(
        (e) => Number(e.param_id) === Number(param.param_id),
      )[0]
      duplicate[indexDynamicFields].fields[0][e.target.name].param = {
        ...param,
        task_id: paramWithTaskId?.task_id,
      }
    } else if (e.target.name === 'reason') {
      duplicate[indexDynamicFields].reason = e.target.value
    } else {
      duplicate[indexDynamicFields].fields[indexFields].cairan[e.target.name] = e.target.value
      if (e.target.name === 'totalCairan') {
        const filtered = maintenanceData?.chemicals?.filter(
          (el) =>
            el.chemical_id ===
            Number(duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan),
        )[0]

        duplicate[indexDynamicFields].fields[indexFields].cairan.biaya =
          Number(filtered.price_per_liter) * Number(e.target.value)
      }
    }

    setDynamicFields(duplicate)
  }

  const handleAddingLiquidFormEvaluation = (indexDynamicFields, indexFields) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].listCairan.isError = false
    duplicate[indexDynamicFields].fields[indexFields].listCairan.errorMessage = ''

    const newData = {
      id: new Date().getTime(),
      tipeCairan: duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan,
      totalCairan: duplicate[indexDynamicFields].fields[indexFields].cairan.totalCairan,
      biaya: duplicate[indexDynamicFields].fields[indexFields].cairan.biaya,
      isEdit: false,
    }

    duplicate[indexDynamicFields].fields[indexFields].listCairan.value.push(newData)
    duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan = ''
    duplicate[indexDynamicFields].fields[indexFields].cairan.totalCairan = 0
    duplicate[indexDynamicFields].fields[indexFields].cairan.biaya = 0
    setDynamicFields(duplicate)
  }

  const handleEditDrainingFormEvaluation = (
    indexDynamicFields,
    indexFields,
    indexCairan,
    event,
  ) => {
    let data = [...dynamicFields]

    data[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan][event.target.name] =
      event.target.value
    const filtered = maintenanceData?.chemicals?.filter(
      (el) =>
        el.chemical_id ===
        Number(
          data[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].tipeCairan,
        ),
    )[0]

    if (event.target.name === 'totalCairan') {
      data[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].biaya =
        Number(filtered.price_per_liter) * Number(event.target.value)
    } else {
      data[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].biaya =
        Number(filtered.price_per_liter) *
        Number(
          data[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].totalCairan,
        )
    }
    setDynamicFields(data)
  }

  const handleEditLiquidFormEval = (indexDynamicFields, indexFields, indexCairan) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].isEdit = true
    setDynamicFields(duplicate)
  }

  const handleEditLiquidDoneFormEval = (indexDynamicFields, indexFields, indexCairan) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields[indexFields].listCairan.value[indexCairan].isEdit = false
    setDynamicFields(duplicate)
  }

  const handleDeleteRowFormEval = (indexDynamicFields, indexFields, idListCairan) => {
    let duplicate = [...dynamicFields]

    duplicate[indexDynamicFields].fields[indexFields].listCairan.value.splice(
      duplicate[indexDynamicFields].fields[indexFields].listCairan.value.findIndex(
        (el) => el.id === idListCairan,
      ),
      1,
    )
    setDynamicFields(duplicate)
  }

  const addFormEvalField = (indexDynamicFields) => {
    let duplicate = [...dynamicFields]
    duplicate[indexDynamicFields].fields.push({
      id: new Date().getTime(),
      oosParam: [...outOfStandardParam],
      parameter: {
        value: [],
        isErrorParameter: false,
        errorMessageParameter: '',
      },
      listCairan: {
        value: [],
        isError: false,
        errorMessage: '',
      },
      cairan: {
        tipeCairan: '',
        totalCairan: 0,
        biaya: 0,
      },
      Visual: {
        value: 1,
        param: {},
      },
      Sludge: {
        value: 9,
        param: {},
      },
      isStink: {
        value: false,
        param: {},
      },
      PH: {
        value: '',
        isError: false,
        errorMessage: '',
        param: {},
      },
      Konsentrasi: {
        value: '',
        isError: false,
        errorMessage: '',
        param: {},
      },
    })
    setDynamicFields(duplicate)
  }

  const generateParamCheck = (filterParameter, fields) => {
    let array = []
    filterParameter.forEach((param) => {
      if (param.param_id === 4) {
        const visualData = fields.Visual
        array.push({
          periodic_check_id: Number(periodic_check_id),
          param_id: visualData.param.param_id,
          option_id: visualData.param.option_id,
          rule_id: visualData.param.rule_id,
          rule_lvl: visualData.param.rule_lvl,
          parent_task_id: visualData.param?.task_id,
          task_status: null,
          task_value: null,
          is_evaluate: true,
        })
      } else if (param.param_id === 8) {
        const sludgeData = fields.Sludge
        array.push({
          periodic_check_id: Number(periodic_check_id),
          param_id: sludgeData.param.param_id,
          option_id: sludgeData.param.option_id,
          rule_id: sludgeData.param.rule_id,
          rule_lvl: sludgeData.param.rule_lvl,
          parent_task_id: sludgeData.param?.task_id,
          task_status: null,
          task_value: null,
          is_evaluate: true,
        })
      } else if (param.param_id === 7) {
        const phData = fields.PH
        array.push({
          periodic_check_id: Number(periodic_check_id),
          param_id: phData?.param?.param_id,
          option_id: phData?.param?.option_id,
          rule_id: phData?.param?.rule_id,
          rule_lvl: phData?.param?.rule_lvl,
          parent_task_id: phData.param?.task_id,
          task_status:
            Number(phData.value) >= Number(phData?.param?.min_value) &&
            Number(phData.value) <= Number(phData?.param?.max_value)
              ? 'OK'
              : 'NG',
          task_value: Number(phData.value),
          is_evaluate: true,
        })
      } else if (param.param_id === 6) {
        const konsentrasiData = fields.Konsentrasi
        array.push({
          periodic_check_id: Number(periodic_check_id),
          param_id: konsentrasiData?.param?.param_id,
          option_id: konsentrasiData?.param?.option_id,
          rule_id: konsentrasiData?.param?.rule_id,
          rule_lvl: konsentrasiData?.param?.rule_lvl,
          parent_task_id: konsentrasiData.param?.task_id,
          task_status:
            Number(konsentrasiData.value) >= Number(konsentrasiData?.param?.min_value) &&
            Number(konsentrasiData.value) <= Number(konsentrasiData?.param?.max_value)
              ? 'OK'
              : 'NG',
          task_value: Number(konsentrasiData.value),
          is_evaluate: true,
        })
      }
    })

    return array
  }

  const validationFormEval = (indexDynamicFields) => {
    let isPassValidation = true
    const emptyLiquidIndex = dynamicFields[indexDynamicFields].fields.findIndex(
      (el) => el.listCairan.value.length === 0,
    )
    let duplicate = [...dynamicFields]

    let indexZeroField = duplicate[indexDynamicFields].fields[0]

    if (emptyLiquidIndex !== -1) {
      dynamicFields[indexDynamicFields].fields.forEach((element, idx) => {
        if (element.listCairan.value.length === 0) {
          duplicate[indexDynamicFields].fields[idx].listCairan.isError = true
          duplicate[indexDynamicFields].fields[idx].listCairan.errorMessage =
            'Penambahan cairan kosong'
        }
      })

      isPassValidation = false
    }

    if (
      !duplicate[indexDynamicFields].fields[0].PH.value &&
      indexZeroField.oosParam.findIndex((el) => el.param_id === 7) !== -1
    ) {
      duplicate[indexDynamicFields].fields[0].PH.isError = true
      duplicate[indexDynamicFields].fields[0].PH.errorMessage = 'PH harus diisi'
      isPassValidation = false
    }
    if (
      !duplicate[indexDynamicFields].fields[0].Sludge.value &&
      indexZeroField.oosParam.findIndex((el) => el.param_id === 8) !== -1
    ) {
      duplicate[indexDynamicFields].fields[0].Sludge.isError = true
      duplicate[indexDynamicFields].fields[0].Sludge.errorMessage = 'Sludge harus diisi'
      isPassValidation = false
    }
    if (
      !duplicate[indexDynamicFields].fields[0].Visual.value &&
      indexZeroField.oosParam.findIndex((el) => el.param_id === 4) !== -1
    ) {
      duplicate[indexDynamicFields].fields[0].Visual.isError = true
      duplicate[indexDynamicFields].fields[0].Visual.errorMessage = 'Visual harus diisi'
      isPassValidation = false
    }

    if (
      !duplicate[indexDynamicFields].fields[0].Konsentrasi.value &&
      indexZeroField.oosParam.findIndex((el) => el.param_id === 6) !== -1
    ) {
      duplicate[indexDynamicFields].fields[0].Konsentrasi.isError = true
      duplicate[indexDynamicFields].fields[0].Konsentrasi.errorMessage = 'Konsentrasi harus diisi'
      isPassValidation = false
    }

    setDynamicFields(duplicate)

    return isPassValidation
  }

  const handleSubmitFormEvaluation = (indexDynamicFields) => {
    let duplicate = [...dynamicFields]
    console.log(duplicate[indexDynamicFields], '===999')

    const isPassValidation = validationFormEval(indexDynamicFields)
    console.log(isPassValidation, ' isPassValidation isPassValidation')

    if (isPassValidation) {
      const filterParameter =
        duplicate[indexDynamicFields].fields[0].parameter.value.length > 0
          ? duplicate[indexDynamicFields].fields[0].parameter.value
          : duplicate[indexDynamicFields].fields[0].oosParam

      const myArrayFiltered = parameterTaskId.filter((el) => {
        return filterParameter.some((f) => {
          return f.param_id === el.param_id
        })
      })

      const tasks_id = []
      myArrayFiltered.forEach((el) => tasks_id.push(el.task_id))

      let drainingRequest = []
      duplicate[indexDynamicFields].fields.forEach((field) => {
        drainingRequest = field.listCairan.value.map((cairan) => ({
          chemical_id: Number(cairan.tipeCairan),
          vol_changes: Number(cairan.totalCairan),
          cost_chemical: Number(cairan.biaya),
          periodic_check_id: Number(periodic_check_id),
          tasks_id: tasks_id,
        }))
      })

      const parameFilled = generateParamCheck(
        filterParameter,
        duplicate[indexDynamicFields].fields[0],
      )

      let sortedPeaks = parameFilled.sort((a, b) => b.rule_lvl - a.rule_lvl)

      const removeParamLevel = parameFilled.map(({ rule_lvl, ...restData }) => restData)

      const payload = {
        periodic_check_id: periodic_check_id,
        chemical_changes: drainingRequest,
        param_check: removeParamLevel,
        rule_id: sortedPeaks[0].rule_id,
        color_status: generateColor(sortedPeaks[0].rule_id),
        notes: duplicate[indexDynamicFields].reason,
      }

      console.log(payload, 'ini rquest akhir====')

      mutateChemicalChangesEvalParam(payload)
    }
  }

  // ====== ====== LIST MAITENANCE ====== ======

  useEffect(() => {
    if (selectedChecksitId) {
      refetchCheckSheetAfterChanges()
    }
  }, [selectedChecksitId, refetchCheckSheetAfterChanges])

  // ====== ====== END LIST MAITENANCE ====== ======

  // console.log(dynamicFields, 'dynamicFields dynamicFields')
  console.log(openModal, 'openModal')

  return (
    <CCol xs={12}>
      <MainForm
        userGroup={userGroup}
        handleSelectEmployee={handleSelectEmployee}
        selectedEmployee={selectedEmployee}
        setStartDate={setStartDate}
        startDate={startDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        endDate={endDate}
        setEndTime={setEndTime}
        endTime={endTime}
        maintenanceData={maintenanceData}
        isActive={dynamicFields?.[0]?.isActive}
      />
      {dynamicFields &&
        dynamicFields.map((dynamicEl, idx) => {
          if (dynamicEl.type === 'draining') {
            return (
              <React.Fragment key={dynamicEl.id}>
                <DrainingForm
                  maintenanceData={maintenanceData}
                  handleAddingLiquid={handleAddingLiquid}
                  handleEditLiquid={handleEditLiquid}
                  handleEditLiquidDone={handleEditLiquidDone}
                  handleEditFormDraining={handleEditFormDraining}
                  dynamicEl={dynamicEl}
                  dynamicElIdPosition={idx}
                  handleChangeFormDraining={handleChangeFormDraining}
                  printTipeCairan={printTipeCairan}
                  handleDelete={handleDelete}
                  parameters={parameters}
                  handleDeleteDrainingField={handleDeleteDrainingField}
                  addDrainingFields={addDrainingFields}
                  handleSubmitDrainingForm={handleSubmitDrainingForm}
                />
              </React.Fragment>
            )
          } else if (dynamicEl.type === 'checking') {
            return (
              <React.Fragment key={dynamicEl.id}>
                <CheckingForm
                  // parametersForm={maintenanceData}
                  handleSubmitCheckingForm={handleSubmitCheckingForm}
                  dynamicEl={dynamicEl}
                  dynamicElIdPosition={idx}
                  handleOnChangeFormChecking={handleOnChangeFormChecking}
                  handleOnFocusFormChecking={handleOnFocusFormChecking}
                />
              </React.Fragment>
            )
          } else if (dynamicEl.type === 'evaluation') {
            return (
              <React.Fragment key={dynamicEl.id}>
                <EvaluationForm
                  printTipeCairan={printTipeCairan}
                  handleAddingLiquidFormEvaluation={handleAddingLiquidFormEvaluation}
                  dynamicEl={dynamicEl}
                  dynamicElIdPosition={idx}
                  maintenanceData={maintenanceData}
                  handleChangeFormEvaluation={handleChangeFormEvaluation}
                  handleOnFocusFormChecking={handleOnFocusFormChecking}
                  handleEditLiquidFormEval={handleEditLiquidFormEval}
                  handleEditDrainingFormEvaluation={handleEditDrainingFormEvaluation}
                  handleEditLiquidDoneFormEval={handleEditLiquidDoneFormEval}
                  handleDeleteRowFormEval={handleDeleteRowFormEval}
                  addFormEvalField={addFormEvalField}
                  handleSubmitFormEvaluation={handleSubmitFormEvaluation}
                />
              </React.Fragment>
            )
          } else {
            return <React.Fragment key={dynamicEl.id}></React.Fragment>
          }
        })}
      <CModal
        visible={openModal.show}
        onClose={() =>
          setOpenModal({
            show: false,
            type: '',
          })
        }
      >
        <CModalHeader>
          <CModalTitle>Sukses</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {openModal.type === 'finish' && 'Evaluasi Selesai'}

          {openModal.type === 'checking' &&
            outOfStandardParam.length === 0 &&
            `Pengecekan Parameter Berhasil dan tidak ada parameter diluar standar, Apakah anda mau melanjutkan ke proses Evaluasi?`}

          {openModal.type === 'checking' &&
            outOfStandardParam.length !== 0 &&
            `Pengecekan Parameter Berhasil dengan ${outOfStandardParam.length} parameter diluar standar, Apakah anda mau melanjutkan ke proses Evaluasi?`}

          {openModal.type === 'draining' &&
            `Penambahan Cairan Berhasil, Apakah anda mau melanjutkan ke proses Pengecekan?`}
        </CModalBody>
        <CModalFooter>
          {openModal.type === 'finish' && (
            <CButton
              color="primary"
              onClick={() => {
                setOpenModal({
                  show: false,
                  type: '',
                })
                navigate(-1)
              }}
            >
              Oke
            </CButton>
          )}
          {openModal.type !== 'finish' && openModal.type !== '' && (
            <>
              <CButton
                color="primary"
                onClick={() => {
                  handleOnConfirmModal()
                }}
              >
                Ya
              </CButton>
              <CButton
                color="primary"
                onClick={() => {
                  setOpenModal({
                    show: false,
                    type: '',
                  })
                  navigate(-1)
                }}
              >
                Tidak
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    </CCol>
  )
}

export default Draining

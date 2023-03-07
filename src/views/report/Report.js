import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import {
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import moment from 'moment'
import { toast } from 'react-toastify'

import 'react-datepicker/dist/react-datepicker.css'

import { DrainingForm, MainForm, CheckingForm, EvaluationForm } from 'src/components'

// API
import {
  getMaintenanceMachineCS,
  getUsersGroup,
  getMachineScheduleList,
  getCheckSheetAfterChanges,
  postCheckSheet,
  postChemicalChangesEvalParam,
} from 'src/utils/api'

moment.locale('id')

const parameters = [
  { name: 'Visual', code: 'VS' },
  { name: 'Sludge', code: 'SL' },
  { name: 'Konsentrasi', code: 'KS' },
  { name: 'PH', code: 'PH' },
]

const drainingTypes = [
  {
    id: '0',
    value: 'solar',
    label: 'Solar',
    biaya: '7000',
  },
  {
    id: '1',
    value: 'pertamax',
    label: 'Pertamax',
    biaya: '13900',
  },
  {
    id: '2',
    value: 'pertalite',
    label: 'Pertalite',
    biaya: '10000',
  },
  {
    id: '3',
    value: 'pelumas',
    label: 'Pelumas',
    biaya: '45000',
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
        if (result?.option_id === 5) {
          final = true
        } else {
          final = false
        }
      }
    }
  })

  return final
}
const generateDefaultParamAroma = (parameters, param_id) => {
  let final = ''
  parameters.forEach((element) => {
    if (element.param_id === param_id) {
      if (param_id === 5) {
        const result = element.options.filter((el) => el.option_id === 6)[0]
        final = { ...element, ...result }
      }
    }
  })

  return final
}

const Report = () => {
  const navigate = useNavigate()
  let { machine_id, periodic_check_id } = useParams()

  // ====== USESTATE

  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [outOfStandardParam, setOutOfStandardParam] = useState({})
  const [selectedChecksitId, setSelectedChecksitId] = useState(1)

  const [parameterTaskId, setParameterTaskId] = useState([])

  const [parameterMaster, setParameterMaster] = useState([])

  const [selectedIndexDynamicField, setSelectedIndexDynamicField] = useState(0)
  // const [isSubmitCheckingForm, setIsSubmitCheckingForm] = useState(false)
  const [selectedVisualOptions, setSelectedVisualOptions] = useState({})
  const [selectedSludgeOptions, setSelectedSludgeOptions] = useState({})
  const [selectedPHOptions, setSelectedPHOptions] = useState({})
  const [selectedKonsentrasiOptions, setSelectedKonsentrasiOptions] = useState({})
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
  })

  const { data: machineScheduleList, refetch: refetchMachineScheduleList } = useQuery(
    ['machine-schedule-list'],
    () => getMachineScheduleList(machine_id, 'null'),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        console.log(data, ' data')
      },
    },
  )

  const { data: checkSheetAfterChanges, refetch: refetchCheckSheetAfterChanges } = useQuery(
    ['check-sheet', machine_id, periodic_check_id],
    () => getCheckSheetAfterChanges(machine_id, periodic_check_id, selectedChecksitId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        console.log('sukse getCheckSheetAfterChanges \n', data)

        let duplicate = [...dynamicFields]
        console.log('refetchCheckSheetAfterChanges refetchCheckSheetAfterChanges', data)
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

  const { data: maintenanceData, refetch: refetchMaintenanceMachine } = useQuery(
    ['check-sheet', machine_id, periodic_check_id],
    () => getMaintenanceMachineCS(machine_id, periodic_check_id),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        return data.data[0]
      },
      onSuccess: (data) => {
        console.log('========')
        console.log(JSON.stringify(data, null, '\t'))
        let duplicate = [...dynamicFields]
        data.parameters?.forEach((param) => {
          if (param.param_nm === 'Visual') {
            let temp = param.options.filter((el) => el.selected_opt)
            if (temp.length === 0) {
              setSelectedVisualOptions({ ...param.options[0], ...param })
            } else {
              setSelectedVisualOptions({ ...temp[0], ...param })
            }
          }
          if (param.param_nm === 'Sludge') {
            let temp = param.options.filter((el) => el.selected_opt)
            if (temp.length === 0) {
              setSelectedSludgeOptions({ ...param.options[0], ...param })
            } else {
              setSelectedSludgeOptions({ ...temp[0], ...param })
            }
          }
        })

        const newDynamicField = {
          id: new Date().getTime(),
          type: 'checking',
          isActive: true,
          fields: [
            {
              // id: new Date().getTime(),
              Visual: {
                value: '',
                isError: false,
                errorMessage: '',
                param: {},
              },
              Sludge: {
                value: '',
                isError: false,
                errorMessage: '',
                param: {},
              },
              isStink: {
                value: generateDefaultFilledCheckSheet(data.chemical_check, 5),
                param: generateDefaultParamAroma(data.chemical_check, 5),
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
          checkingMaintenanceList: [],
          selectedCheckMaintenance: '',
          paramRender: [
            {
              parameters: data.chemical_check,
            },
          ],
        }

        setParameterMaster(data.chemical_check)

        duplicate.push(newDynamicField)
        setDynamicFields(duplicate)
      },
    },
  )

  const { mutate } = useMutation(postCheckSheet, {
    onSuccess: ({ data }) => {
      let duplicate = [...dynamicFields]
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

  // ====== START CHECKING FORM
  const handleSubmitCheckingFormValidation = (indexDynamicFields) => {
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

    let duplicate = [...dynamicFields]
    if (!duplicate[indexDynamicFields].fields[0].PH.value) {
      duplicate[indexDynamicFields].fields[0].PH.isError = true
      duplicate[indexDynamicFields].fields[0].PH.errorMessage = 'PH harus diisi'
      isPassValidation = false
    }

    if (!duplicate[indexDynamicFields].fields[0].Visual.value) {
      duplicate[indexDynamicFields].fields[0].Visual.isError = true
      duplicate[indexDynamicFields].fields[0].Visual.errorMessage = 'Visual harus diisi'
      isPassValidation = false
    }
    if (!duplicate[indexDynamicFields].fields[0].Sludge.value) {
      duplicate[indexDynamicFields].fields[0].Sludge.isError = true
      duplicate[indexDynamicFields].fields[0].Sludge.errorMessage = 'Sludge harus diisi'
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
    let mainFormReq = {}
    let checkingReq = {}

    if (indexDynamicFields === 0) {
      mainFormReq = {
        user_id: selectedEmployee.user_id,
        startDate: `${moment(startDate.value).format('YYYY-MM-DD')} ${moment(
          startTime.value,
        ).format('HH:mm:00')}`,
        endDate: `${moment(endDate.value).format('YYYY-MM-DD')} ${moment(endTime.value).format(
          'HH:mm:00',
        )}`,
      }
    }

    const phData = duplicate[indexDynamicFields].fields[0].PH
    const konsentrasiData = duplicate[indexDynamicFields].fields[0].Konsentrasi
    const visualData = duplicate[indexDynamicFields].fields[0].Visual
    const sludgeData = duplicate[indexDynamicFields].fields[0].Sludge
    const isStinkData = duplicate[indexDynamicFields].fields[0].isStink

    checkingReq = [
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
        param_id: isStinkData.param.param_id,
        option_id: isStinkData.param.option_id,
        rule_id: isStinkData.param.rule_id,
        task_status: null,
        task_value: null,
      },
      {
        periodic_check_id: Number(periodic_check_id),
        param_id: konsentrasiData?.param?.param_id,
        option_id: konsentrasiData?.param?.options?.[0]?.option_id,
        rule_id: konsentrasiData?.param?.options?.[0]?.rule_id,
        task_status:
          Number(konsentrasiData.value) >=
            Number(konsentrasiData?.param?.options?.[0]?.min_value) &&
          Number(konsentrasiData.value) <= Number(konsentrasiData?.param?.options?.[0]?.max_value)
            ? 'OK'
            : 'NG',
        task_value: Number(konsentrasiData.value),
      },
      {
        periodic_check_id: Number(periodic_check_id),
        param_id: phData?.param?.param_id,
        option_id: phData?.param?.options?.[0]?.option_id,
        rule_id: phData?.param?.options?.[0]?.rule_id,
        task_status:
          Number(phData.value) >= Number(phData?.param?.options?.[0]?.min_value) &&
          Number(phData.value) <= Number(phData?.param?.options?.[0]?.max_value)
            ? 'OK'
            : 'NG',
        task_value: Number(phData.value),
      },
      {
        periodic_check_id: Number(periodic_check_id),
        param_id: sludgeData.param.param_id,
        option_id: sludgeData.param.option_id,
        rule_id: sludgeData.param.rule_id,
        task_value: null,
        task_status: null,
      },
    ]

    let arrayHead = Object.keys(duplicate[indexDynamicFields].fields[0])
    let temp = duplicate[indexDynamicFields].fields[0]
    const oosParam = []
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
    })

    console.log(oosParam, '-------')

    setOutOfStandardParam(oosParam)

    const allRuleLevel = [
      visualData.param.rule_lvl,
      sludgeData.param.rule_lvl,
      isStinkData.param.rule_lvl,
      phData.param.rule_lvl,
      konsentrasiData.param.rule_lvl,
    ]
    console.log(allRuleLevel, 'allRuleLevel')

    console.log(checkingReq, ' checkingReq checkingReq')
    console.log(mainFormReq, 'mainForm')

    if (isPassValidation) {
      const payload = {
        periodic_check_id: Number(periodic_check_id),
        start_date: mainFormReq.startDate,
        finish_date: mainFormReq.endDate,
        pic: selectedEmployee.user_id,
        group_id: selectedEmployee.group_id,
        checksheet_id: Number(maintenanceData.checksheet_id),
        rule_id: Math.max(...allRuleLevel),
        parameters_check: checkingReq,
      }
      mutate(payload)
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

    if (e.target.name === 'previewVisualImg') {
      const file = e.target.files[0]
      duplicate[indexDynamicFields].fields[0].Visual[e.target.name] = URL.createObjectURL(file)
    } else if (e.target.name === 'previewSludgeImg') {
      const file = e.target.files[0]
      duplicate[indexDynamicFields].fields[0].Sludge[e.target.name] = URL.createObjectURL(file)
    } else if (e.target.name === 'isStink') {
      duplicate[indexDynamicFields].fields[0][e.target.name].value = e.target.checked
      duplicate[indexDynamicFields].fields[0][e.target.name].param = param
    } else if (e.target.name === 'Sludge') {
      duplicate[indexDynamicFields].fields[0][e.target.name].isError = false
      duplicate[indexDynamicFields].fields[0][e.target.name].errorMessage = ''
      duplicate[indexDynamicFields].fields[0].Sludge.value = Number(e.target.value)
      duplicate[indexDynamicFields].fields[0].Sludge.param = param
    } else if (e.target.name === 'Visual') {
      duplicate[indexDynamicFields].fields[0][e.target.name].isError = false
      duplicate[indexDynamicFields].fields[0][e.target.name].errorMessage = ''
      duplicate[indexDynamicFields].fields[0].Visual.value = Number(e.target.value)
      duplicate[indexDynamicFields].fields[0].Visual.param = param
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

  // ====== START OF DRAINING FORM

  const validationDrainingForm = (indexDynamicFields) => {
    let isPassValidation = true

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
    const filtered = drainingTypes.filter((el) => el.id === id)[0]

    return filtered.label
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
    }

    duplicate[indexDynamicFields].fields[indexFields].listCairan.push(newData)
    duplicate[indexDynamicFields].fields[indexFields].cairan.tipeCairan = ''
    duplicate[indexDynamicFields].fields[indexFields].cairan.totalCairan = 0
    duplicate[indexDynamicFields].fields[indexFields].cairan.biaya = 0
    setDynamicFields(duplicate)
  }

  const handleChangeFormDraining = (indexDynamicFields, indexFields, event, additionalName) => {
    let data = [...dynamicFields]
    if (data[indexDynamicFields].type === 'draining') {
      if (additionalName === 'parameter') {
        data[indexDynamicFields].fields[indexFields].parameter = event.value
        data[indexDynamicFields].fields[indexFields].isErrorParameter = false
        data[indexDynamicFields].fields[indexFields].errorMessageParameter = ''
      } else {
        data[indexDynamicFields].fields[indexFields].cairan[event.target.name] = event.target.value
        if (event.target.name === 'totalCairan') {
          const filtered = drainingTypes.filter(
            (el) => el.id === data[indexDynamicFields].fields[indexFields].cairan.tipeCairan,
          )[0]

          data[indexDynamicFields].fields[indexFields].cairan.biaya =
            Number(filtered.biaya) * Number(event.target.value)
        }
      }
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
    if (isPassValidation) {
      setOpenModal({
        show: true,
        type: 'draining',
      })
      let duplicate = [...dynamicFields]
      duplicate[indexDynamicFields].isActive = false
      setDynamicFields(duplicate)
    }
  }

  // ====== END OF DRAINING FORM

  // ====== ====== GENERAL ====== ======

  const handleOnConfirmModal = () => {
    let newDynamicFields = {}
    let duplicate = [...dynamicFields]
    if (openModal.type === 'draining') {
      refetchMaintenanceMachine()
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
      // duplicate.push(newDynamicFields)
      // setDynamicFields(duplicate)
    }

    duplicate.push(newDynamicFields)
    setDynamicFields(duplicate)
    setOpenModal({
      show: false,
      type: '',
    })
  }

  const handleSelectEmployee = (e) => {
    const filterEmployee = userGroup?.filter((el) => el.user_id === Number(e.target.value))[0]
    setSelectedEmployee(filterEmployee)
  }

  const { mutate: mutateChemicalChangesEvalParam } = useMutation(postChemicalChangesEvalParam, {
    onSuccess: ({ data }) => {
      console.log(JSON.stringify(data, null, '\t'), '===== ini dia reulsttt')
      let duplicate = [...dynamicFields]

      duplicate[selectedIndexDynamicField].isActive = false
      setDynamicFields(duplicate)
      setOpenModal({
        show: true,
        type: 'finish',
      })
    },
    onError: ({ response }) => {
      toast.error(response.data.message)
    },
  })

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
    } else if (
      e.target.name === 'PH' ||
      e.target.name === 'Konsentrasi' ||
      e.target.name === 'Sludge' ||
      e.target.name === 'Visual'
    ) {
      duplicate[indexDynamicFields].fields[0][e.target.name].value = Number(
        e.target.value.replace(/[^0-9.]/g, ''),
      )

      const paramWithTaskId = parameterTaskId.filter(
        (e) => Number(e.param_id) === Number(param.param_id),
      )[0]
      console.log('filterdtaskid')
      duplicate[indexDynamicFields].fields[0][e.target.name].param = {
        ...param,
        task_id: paramWithTaskId.task_id,
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

  const handleSubmitFormEvaluation = (indexDynamicFields) => {
    let duplicate = [...dynamicFields]
    console.log(duplicate[indexDynamicFields], '=== inindiaaa')

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

    const payload = {
      periodic_check_id: periodic_check_id,
      chemical_changes: drainingRequest,
      param_check: generateParamCheck(filterParameter, duplicate[indexDynamicFields].fields[0]),
    }

    console.log(payload, 'ini rquest akhir====')

    mutateChemicalChangesEvalParam(payload)
  }

  // console.log(dynamicFields, ' dynamicFields dynamicFields')
  // console.log(maintenanceData, ' maintenanceData maintenanceData')
  // console.log(selectedVisualOptions, ' temp')
  // console.log(machineScheduleList, ' machineScheduleList')
  console.log(dynamicFields, ' dynamicFields')

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
        isActive={dynamicFields?.[0]?.isActive}
      />
      {dynamicFields &&
        dynamicFields.map((dynamicEl, idx) => {
          if (dynamicEl.type === 'draining') {
            return (
              <React.Fragment key={dynamicEl.id}>
                <DrainingForm
                  handleAddingLiquid={handleAddingLiquid}
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
                  parametersForm={maintenanceData}
                  handleSubmitCheckingForm={handleSubmitCheckingForm}
                  dynamicEl={dynamicEl}
                  dynamicElIdPosition={idx}
                  handleOnChangeFormChecking={handleOnChangeFormChecking}
                  handleOnFocusFormChecking={handleOnFocusFormChecking}
                />
              </React.Fragment>
            )
          } else {
            return <React.Fragment key={dynamicEl.id}></React.Fragment>
          }
          // else if (dynamicEl.type === 'evaluation') {
          //   return (
          //     <React.Fragment key={dynamicEl.id}>
          //       <EvaluationForm
          //         printTipeCairan={printTipeCairan}
          //         handleAddingLiquidFormEvaluation={handleAddingLiquidFormEvaluation}
          //         dynamicEl={dynamicEl}
          //         dynamicElIdPosition={idx}
          //         maintenanceData={maintenanceData}
          //         handleChangeFormEvaluation={handleChangeFormEvaluation}
          //         handleOnFocusFormChecking={handleOnFocusFormChecking}
          //         handleEditLiquidFormEval={handleEditLiquidFormEval}
          //         handleEditDrainingFormEvaluation={handleEditDrainingFormEvaluation}
          //         handleEditLiquidDoneFormEval={handleEditLiquidDoneFormEval}
          //         handleDeleteRowFormEval={handleDeleteRowFormEval}
          //         addFormEvalField={addFormEvalField}
          //         handleSubmitFormEvaluation={handleSubmitFormEvaluation}
          //       />
          //     </React.Fragment>
          //   )
          // }
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
          {`${
            openModal.type === 'checking' ? 'Pengecekan Parameter' : 'Penambahan Cairan'
          } Berhasil, Apakah anda mau melanjutkan ke proses ${
            openModal.type === 'checking' ? 'Penambahan Cairan' : 'Pengecekan Parameter'
          }?`}
        </CModalBody>
        <CModalFooter>
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
        </CModalFooter>
      </CModal>
    </CCol>
  )
}

export default Report

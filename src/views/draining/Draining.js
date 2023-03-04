import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import moment from 'moment'
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

import { DrainingForm, MainForm, CheckingForm } from 'src/components'

import UploadImagePlaceholder from 'src/assets/images/Placeholder.jpg'

// API
import { getMaintenanceMachineCS, getUsersGroup, getMachineScheduleList } from 'src/utils/api'

moment.locale('id')

const parameters = [
  { name: 'Visual', code: 'VS' },
  { name: 'Sludge', code: 'SL' },
  { name: 'Konsentrasi', code: 'KS' },
  { name: 'PH', code: 'PH' },
]

const Draining = () => {
  const navigate = useNavigate()
  let { machine_id, periodic_check_id } = useParams()

  // ====== USESTATE

  const [selectedEmployee, setSelectedEmployee] = useState({})
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
  const [dynamicFields, setDynamicFields] = useState([
    {
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
    },
  ])

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
    () => getMachineScheduleList(machine_id, 'notnull'),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
    },
  )

  const { data: maintenanceData, refetch: refetchChechSheet } = useQuery(
    ['check-sheet', machine_id, periodic_check_id],
    () => getMaintenanceMachineCS(machine_id, periodic_check_id),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        return data.data
      },
    },
  )

  // END USEQUERY

  // ====== START CHECKING FORM

  // useEffect(() => {
  //   if (isSubmitCheckingForm) {
  //     refetchMachineScheduleList()
  //     setIsSubmitCheckingForm(false)
  //   }
  // }, [isSubmitCheckingForm, refetchMachineScheduleList])

  const handleSubmitCheckingFormValidation = (indexDynamicFields) => {
    let isPassValidation = true
    let duplicate = [...dynamicFields]
    if (!duplicate[indexDynamicFields].fields[0].PH.value) {
      duplicate[indexDynamicFields].fields[0].PH.isError = true
      duplicate[indexDynamicFields].fields[0].PH.errorMessage = 'PH harus diisi'
      isPassValidation = false
    } else {
      isPassValidation = true
    }

    if (!duplicate[indexDynamicFields].fields[0].Konsentrasi.value) {
      duplicate[indexDynamicFields].fields[0].Konsentrasi.isError = true
      duplicate[indexDynamicFields].fields[0].Konsentrasi.errorMessage = 'Konsentrasi harus diisi'
      isPassValidation = false
    } else {
      isPassValidation = true
    }

    setDynamicFields(duplicate)

    return isPassValidation
  }

  const handleSubmitCheckingForm = (indexDynamicFields) => {
    const isPassValidation = handleSubmitCheckingFormValidation(indexDynamicFields)

    if (isPassValidation) {
      setOpenModal({
        show: true,
        type: 'checking',
      })
      let duplicate = [...dynamicFields]
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

  const handleOnChangeFormChecking = (indexDynamicFields, e) => {
    let duplicate = [...dynamicFields]
    if (e.target.name === 'previewVisualImg') {
      const file = e.target.files[0]
      duplicate[indexDynamicFields].fields[0].Visual[e.target.name] = URL.createObjectURL(file)
    } else if (e.target.name === 'Visual') {
      duplicate[indexDynamicFields].fields[0].Visual.value = Number(e.target.value)
    } else if (e.target.name === 'previewSludgeImg') {
      const file = e.target.files[0]
      duplicate[indexDynamicFields].fields[0].Sludge[e.target.name] = URL.createObjectURL(file)
    } else if (e.target.name === 'Sludge') {
      duplicate[indexDynamicFields].fields[0].Sludge.value = Number(e.target.value)
    } else if (e.target.name === 'isStink') {
      duplicate[indexDynamicFields].fields[0][e.target.name] = e.target.checked
    } else {
      duplicate[indexDynamicFields].fields[0][e.target.name].value = e.target.value.replace(
        /[^0-9.]/g,
        '',
      )
    }

    setDynamicFields(duplicate)
  }
  // ====== END CHECKING FORM

  // ====== START OF DRAINING FORM

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
        user_id: selectedEmployee.user_id,
        startDate: `${moment(startDate.value).format('YYYY-MM-DD')} ${moment(
          startTime.value,
        ).format('HH:mm:00')}`,
        endDate: `${moment(endDate.value).format('YYYY-MM-DD')} ${moment(endTime.value).format(
          'HH:mm:00',
        )}`,
      }
    }

    duplicate[indexDynamicFields].fields.forEach((field) => {
      drainingRequest = field.listCairan.map((cairan) => ({
        chemical_id: Number(cairan.tipeCairan),
        vol_changes: Number(cairan.totalCairan),
        cost_chemical: Number(cairan.biaya),
        periodic_check_id,
      }))
    })

    if (isPassValidation) {
      refetchMachineScheduleList()
      // setOpenModal({
      //   show: true,
      //   type: 'draining',
      // })
      // duplicate[indexDynamicFields].isActive = false
      // setDynamicFields(duplicate)
      // console.log(drainingRequest, ' drainingRequest drainingRequest')
      // console.log(mainFormReq)
    }
  }

  // ====== END OF DRAINING FORM

  // ====== ====== GENERAL ====== ======

  const handleOnConfirmModal = () => {
    let newDynamicFields = {}
    let duplicate = [...dynamicFields]
    if (openModal.type === 'draining') {
      refetchChechSheet()
      newDynamicFields = {
        id: new Date().getTime(),
        type: 'checking',
        isActive: true,
        fields: [
          {
            id: new Date().getTime(),
            Visual: {
              value: 1,
              previewVisualImg: UploadImagePlaceholder,
            },
            Sludge: {
              value: 9,
              previewSludgeImg: UploadImagePlaceholder,
            },
            isStink: false,
            PH: {
              value: '',
              isError: false,
              errorMessage: '',
            },
            Konsentrasi: {
              value: '',
              isError: false,
              errorMessage: '',
            },
          },
        ],
      }
    } else {
      newDynamicFields = {
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
          },
        ],
      }
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

  console.log(machineScheduleList, 'machineScheduleList ')

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
        isActive={dynamicFields[0].isActive}
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
          } else {
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

export default Draining

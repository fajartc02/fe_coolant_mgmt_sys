import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
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
import { getCheckSheet } from 'src/utils/api'

import EmployeeData from 'src/assets/json/employee.json'

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

const Draining = () => {
  const navigate = useNavigate()
  let { machine_id } = useParams()

  // ====== USESTATE

  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [startDate, setStartDate] = useState({
    value: '',
    isError: false,
    errorMessage: '',
  })
  const [startTime, setStartTime] = useState({
    value: '',
    isError: false,
    errorMessage: '',
  })
  const [endDate, setEndDate] = useState({
    value: '',
    isError: false,
    errorMessage: '',
  })
  const [endTime, setEndTime] = useState({
    value: '',
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
        },
      ],
    },
  ])

  // ====== END OF USESTATE

  // ====== START CHECKING FORM

  const { data: checkSheetData, refetch: refetchChechSheet } = useQuery(
    ['check-sheet', machine_id],
    () => getCheckSheet(machine_id),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      select: ({ data }) => {
        return data.data
      },
    },
  )

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
              value: 7,
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
    const filterEmployee = EmployeeData.filter((el) => el.employeeId === e.target.value)[0]
    setSelectedEmployee(filterEmployee)
  }

  console.log(dynamicFields, ' dynamicFields dynamicFields')

  return (
    <CCol xs={12}>
      <MainForm
        employees={EmployeeData}
        setSelectedEmployee={setSelectedEmployee}
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
          } else {
            return (
              <React.Fragment key={dynamicEl.id}>
                <CheckingForm
                  parametersForm={checkSheetData}
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

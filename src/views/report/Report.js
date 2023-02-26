import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useParams, useNavigate } from 'react-router-dom'

import { MultiSelect } from 'primereact/multiselect'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'

import id from 'date-fns/locale/id'
import {
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCard,
  CCardBody,
  CFormSwitch,
  CFormCheck,
  CInputGroupText,
  CInputGroup,
  CCardHeader,
  CButton,
  CForm,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCollapse,
  CCardFooter,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuery } from 'react-query'

import 'react-datepicker/dist/react-datepicker.css'

import UploadImagePlaceholder from '../../assets/images/Placeholder.jpg'
import Coktu from '../../assets/images/coktu.png'
import Cok from '../../assets/images/cok.png'
import PutCok from '../../assets/images/putcok.png'
import Putih from '../../assets/images/putih.png'
import Sedang from '../../assets/images/sedang.png'
import Banyak from '../../assets/images/banyak.png'
import Sedikit from '../../assets/images/sedikit.png'
import EmployeeData from '../../assets/json/employee.json'
import FormParameter from '../../assets/json/form-parameter.json'

// API
import { getCheckSheet } from 'src/utils/api'
import CIcon from '@coreui/icons-react'

import { cilCheckCircle, cilWarning, cilXCircle, cilPlus, cilTrash, cilX } from '@coreui/icons'

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

const schema = yup
  .object({
    startDate: yup.string().required('Start Date harus diisi'),
    startTime: yup.string().required('Start Time harus diisi'),
    endDate: yup.string().required('End Date harus diisi'),
    endTime: yup
      .string()
      .required('End Time harus diisi')
      .test('more', 'End Time tidak boleh lebih kecil daripada startTime', (value, schema) => {
        return new Date(schema.parent.startTime).getTime() < new Date(value).getTime()
      }),
    employeeId: yup
      .string()
      .required('Karyawan harus dipilih')
      .notOneOf(['select'], 'PIC harus dipilih'),
    PH: yup.string().required('PH harus diisi'),
    Konsentrasi: yup.string().required('Konsentrasi harus diisi'),
  })
  .required()

const Report = () => {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState({
    show: false,
    type: '',
  })

  const [selectedCities, setSelectedCities] = useState(null)
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]
  const [type, setType] = useState('')
  const [isShowIndikator, setIsShowIndikator] = useState(false)
  const [visual, setVisual] = useState('Putih')
  const [visualStatus, setVisualStatus] = useState(1)
  const [sludge, setSludge] = useState('sedang')
  const [sludgeStatus, setSludgeStatus] = useState(1)
  const [isPhOutOfStandar, setIsPhOutOfStandar] = useState(false)
  const [isKonsentrasiOutOfStandar, setIsKonsentrasiOutOfStandar] = useState(false)
  const [isStink, setIsStink] = useState(false)
  const [imagePrev, setImagePrev] = useState(UploadImagePlaceholder)
  const [employees, setEmployees] = useState(EmployeeData)
  const [selectedEmployee, setSelectedEmployee] = useState(EmployeeData)
  const [drainingFields, setDataDrainingFields] = useState([
    {
      id: new Date().getTime(),
      parameter: null,
      listCairan: [],
      cairan: {
        tipeCairan: '',
        totalCairan: 0,
        biaya: 0,
      },
    },
  ])
  const [dataDraining, setDataDraining] = useState([
    {
      id: '0',
      tipe: 'Pertamax',
      jumlah: '10',
    },
    {
      id: '1',
      tipe: 'Solar',
      jumlah: '2',
    },
  ])
  let { machine_id, machine_name } = useParams()

  const { data: checkSheetData } = useQuery(
    ['check-sheet', machine_id],
    () => getCheckSheet(machine_id),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        return data.data
      },
    },
  )

  const {
    watch,
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleOnChangeImage = (e) => {
    const file = e.target.files[0]
    setImagePrev(URL.createObjectURL(file))
  }

  const handleSelectOptionsEmployee = (e) => {
    const filterData = employees.filter((el) => el.employeeId === e.target.value)[0]
    if (!filterData) return
    setSelectedEmployee(filterData)
  }

  const handleChangeInputFlavorful = () => {
    setIsStink(!isStink)
  }

  const imageDefault = (name) => {
    if (name === 'Visual') {
      switch (visual) {
        case 'Coklat Tua':
          return Coktu
        case 'Putih Kecoklatan':
          return PutCok
        case 'Coklat':
          return Cok
        default:
          return Putih
      }
    } else {
      switch (sludge) {
        case 'Sedikit':
          return Sedikit
        case 'Sedang':
          return Sedang
        default:
          return Banyak
      }
    }
  }

  const formOptionsNote = (status, paramName) => {
    if (status === 1) {
      return (
        <CCol
          md={{ offset: 2 }}
          style={{
            marginTop: '-10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CIcon
            icon={cilCheckCircle}
            style={{ color: '#47f213', marginRight: '5px', marginTop: '2px' }}
          />
          <div className="success-form">{`Status ${paramName} : Safe`}</div>
        </CCol>
      )
    } else if (status === 2) {
      return (
        <CCol
          md={{ offset: 2 }}
          style={{
            marginTop: '-10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CIcon
            icon={cilWarning}
            style={{ color: '#ffff00', marginRight: '5px', marginTop: '2px' }}
          />
          <div className="warning-form">{`Status ${paramName} : Warning`}</div>
        </CCol>
      )
    } else {
      return (
        <CCol
          md={{ offset: 2 }}
          style={{
            marginTop: '-10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CIcon
            icon={cilXCircle}
            style={{ color: '#e55353', marginRight: '5px', marginTop: '2px' }}
          />
          <div className="error-form">{`Status ${paramName} : Danger`}</div>
        </CCol>
      )
    }
  }

  const handleChangeFileOption = (param, value) => {
    const optionSelected = param.options.filter((el) => el.opt_nm === value)[0]
    if (param.param_nm === 'Visual') {
      setVisual(value)
      setVisualStatus(optionSelected.rule_lvl)
    } else {
      setSludge(value)
      setSludgeStatus(optionSelected.rule_lvl)
    }
  }

  const onSubmit = (data) => {
    setOpenModal({
      show: true,
      type: 'check',
    })
    console.log('masma')
    // console.log(data, '===')
    // console.log(
    //   new Date().getTime(getValues().startTime),
    //   'new Date().getTime(getValues().startTime)s',
    // )
  }

  const handleSelectOptionsType = (e) => {
    const filterData = drainingTypes.filter((el) => el.id === e.target.value)[0]
    if (!filterData) return

    console.log(filterData, 'filterData')
    setType(filterData.id)
  }

  const handleInputValueStatus = (param) => {
    handleNumberTypeInput(param.param_nm)
    const paramOption = param.options[0]
    const inputValue = getValues()[param.param_nm]

    if (
      inputValue &&
      (Number(inputValue) < paramOption.min_value || Number(inputValue) > paramOption.max_value)
    ) {
      if (param.param_nm === 'PH') {
        setIsPhOutOfStandar(true)
      } else {
        setIsKonsentrasiOutOfStandar(true)
      }
    } else {
      if (param.param_nm === 'PH') {
        setIsPhOutOfStandar(false)
      } else {
        setIsKonsentrasiOutOfStandar(false)
      }
    }
  }

  const handleNumberTypeInput = (name) => {
    const allValue = getValues()
    const numberOnlyText = allValue[name].replace(/[^0-9.]/g, '')
    setValue(name, numberOnlyText)
  }

  const handleFormRepeaterChange = (index, event, addiotionalName) => {
    // const fieldName = event.target.name
    let data = [...drainingFields]
    if (addiotionalName === 'parameter') {
      data[index].parameter = event.value
    } else {
      data[index].cairan[event.target.name] = event.target.value
      if (event.target.name === 'totalCairan') {
        const filtered = drainingTypes.filter((el) => el.id === data[index].cairan.tipeCairan)[0]
        data[index].cairan.biaya = Number(filtered.biaya) * Number(event.target.value)
      }
    }
    setDataDrainingFields(data)
  }

  const handleAddIndikator = (index) => {
    let duplicate = [...drainingFields]
    const newData = {
      id: new Date().getTime(),
      tipeCairan: duplicate[index].cairan.tipeCairan,
      totalCairan: duplicate[index].cairan.totalCairan,
      biaya: duplicate[index].cairan.biaya,
    }
    duplicate[index].listCairan.push(newData)

    duplicate[index].cairan.tipeCairan = ''
    duplicate[index].cairan.totalCairan = 0
    duplicate[index].cairan.biaya = 0

    setDataDrainingFields(duplicate)
  }

  const handleDelete = (idField, idListCairan) => {
    let duplicate = [...drainingFields]
    duplicate[idField].listCairan.splice(
      duplicate[idField].listCairan.findIndex((el) => el.id === idListCairan),
      1,
    )
    setDataDrainingFields(duplicate)
  }

  const printTipeCairan = (id) => {
    const filtered = drainingTypes.filter((el) => el.id === id)[0]

    return filtered.label
  }

  const addDrainingFields = () => {
    let duplicate = [...drainingFields]
    duplicate.push({
      id: new Date().getTime(),
      parameter: '',
      listCairan: [],
      cairan: {
        tipeCairan: '',
        totalCairan: 0,
        biaya: 0,
      },
    })
    setDataDrainingFields(duplicate)
  }

  const handleDeleteDrainingField = (idField) => {
    let duplicate = [...drainingFields]
    if (duplicate.length === 1) return

    duplicate.splice(
      duplicate.findIndex((el) => el.id === idField),
      1,
    )
    setDataDrainingFields(duplicate)
  }

  // console.log(getValues())

  return (
    <CCol xs={12}>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard className="mb-4" color="white">
          <CCardBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="machineName" className="col-sm-2 col-form-label">
                Machine Name
              </CFormLabel>
              <CCol sm={5}>
                <CFormInput type="text" id="machineName" value={machine_name} disabled />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="pic" className="col-sm-2 col-form-label">
                PIC
              </CFormLabel>
              <CCol md={5}>
                <CFormSelect {...register('employeeId')}>
                  <option value="select" disabled>
                    Silakan Pilih PIC
                  </option>
                  {employees.map((element, index) => (
                    <option value={element.employeeId} key={index}>
                      {element.name}
                    </option>
                  ))}
                </CFormSelect>
                <div className="error-form">{errors.employeeId?.message}</div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="pic" className="col-sm-2 col-form-label">
                Group/Shift
              </CFormLabel>
              <CCol sm={5}>
                <CButton
                  color={selectedEmployee.group === 'red' ? 'danger' : 'white'}
                  style={{
                    border: '0.5px solid #c4c9d0',
                    backgroundColor: selectedEmployee.group === 'red' ? 'red' : 'white',
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </CButton>
                {/* <CFormInput type="text" id="PH" value={selectedMachine.machineName} disabled /> */}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="startDate" className="col-sm-2 col-form-label">
                Start Date
              </CFormLabel>
              <CCol sm="3">
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={'form-control'}
                      placeholderText="dd/MM/yyyy"
                      id="startDate"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                    />
                  )}
                />
                <div className="error-form">{errors.startDate?.message}</div>
              </CCol>
              <CCol sm="2">
                <Controller
                  control={control}
                  name="startTime"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={'form-control'}
                      placeholderText="time-date"
                      id="startTime"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      locale={id}
                    />
                  )}
                />
                <div className="error-form">{errors.startTime?.message}</div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="endDate" className="col-sm-2 col-form-label">
                End Date
              </CFormLabel>
              <CCol sm="3">
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={'form-control'}
                      placeholderText="dd/MM/yyyy"
                      id="endDate"
                      dateFormat="dd/MM/yyyy"
                      disabled={!watch('startDate')}
                      minDate={getValues().startDate}
                    />
                  )}
                />
                <div className="error-form">{errors.endDate?.message}</div>
              </CCol>
              <CCol sm="2">
                <Controller
                  control={control}
                  name="endTime"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={'form-control'}
                      placeholderText="time-date"
                      id="time"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      locale={id}
                      disabled={!watch('startTime')}
                    />
                  )}
                />
                <div className="error-form">{errors.endTime?.message}</div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        {/* PARAMETER */}
        <CCard color="white" className="mb-4">
          <CCardHeader>Parameter</CCardHeader>
          <CCardBody>
            {checkSheetData &&
              checkSheetData[0].parameters?.map((param, id) => {
                switch (param.param_nm) {
                  case 'Sludge':
                    return (
                      <div key={id}>
                        <div style={{ display: 'flex', marginTop: '30px' }}>
                          <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                            {param.param_nm}
                          </CFormLabel>
                          <CTable className="text-center mx-auto w-auto">
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">Acuan</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell>
                                  <img
                                    src={imageDefault(param.param_nm)}
                                    alt=""
                                    style={{
                                      height: '200px',
                                      width: '200px',
                                      margin: 'auto',
                                    }}
                                  />
                                  <input
                                    type="file"
                                    id="imageInpt"
                                    style={{ display: 'none' }}
                                    onChange={handleOnChangeImage}
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                          <CTable className="text-center mx-auto w-auto">
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell align="middle" className="align-midle">
                                  Aktual
                                </CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell>
                                  <img
                                    src={imagePrev}
                                    alt="uploadedImage"
                                    id="uploadedImage"
                                    style={{
                                      height: '200px',
                                      width: '200px',
                                      margin: 'auto',
                                    }}
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell className="align-midle">&nbsp;</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell className="align-middle">
                                  {param.options.map((el, index) => (
                                    <CFormCheck
                                      defaultChecked={index === 0}
                                      type="radio"
                                      value={el.opt_nm}
                                      name={param.param_nm}
                                      label={el.opt_nm}
                                      key={index}
                                      onChange={(e) =>
                                        handleChangeFileOption(param, e.target.value)
                                      }
                                    />
                                  ))}
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                        </div>
                        <CRow>{formOptionsNote(sludgeStatus, param.param_nm)}</CRow>
                      </div>
                    )
                  case 'Visual':
                    return (
                      <div key={id}>
                        <div style={{ display: 'flex', marginTop: '30px' }}>
                          <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                            {param.param_nm}
                          </CFormLabel>
                          <CTable className="text-center mx-auto w-auto">
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col">Acuan</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell>
                                  <img
                                    src={imageDefault(param.param_nm)}
                                    alt=""
                                    style={{
                                      height: '200px',
                                      width: '200px',
                                      margin: 'auto',
                                    }}
                                  />
                                  <input
                                    type="file"
                                    id="imageInpt"
                                    style={{ display: 'none' }}
                                    onChange={handleOnChangeImage}
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                          <CTable className="text-center mx-auto w-auto">
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell className="align-midle">Aktual</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell>
                                  <img
                                    src={imagePrev}
                                    alt="uploadedImage"
                                    id="uploadedImage"
                                    style={{
                                      height: '200px',
                                      width: '200px',
                                      margin: 'auto',
                                    }}
                                  />
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                          <CTable>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell className="align-midle">&nbsp;</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              <CTableRow>
                                <CTableDataCell className="align-middle">
                                  {param.options.map((el, index) => (
                                    <CFormCheck
                                      defaultChecked={index === 0}
                                      type="radio"
                                      value={el.opt_nm}
                                      name={param.param_nm}
                                      label={el.opt_nm}
                                      key={index}
                                      onChange={(e) =>
                                        handleChangeFileOption(param, e.target.value)
                                      }
                                    />
                                  ))}
                                </CTableDataCell>
                              </CTableRow>
                            </CTableBody>
                          </CTable>
                        </div>
                        <CRow>{formOptionsNote(visualStatus, param.param_nm)}</CRow>
                      </div>
                    )
                  case 'Aroma':
                    return (
                      <CRow className="mb-3" key={id}>
                        <CFormLabel className="col-sm-2 col-form-label">
                          {param.param_nm}
                        </CFormLabel>
                        <CCol sm={5} style={{ paddingTop: '7px' }}>
                          <CFormSwitch
                            label={isStink ? param.options[1].opt_nm : param.options[0].opt_nm}
                            id="formSwitchCheckChecked"
                            value={isStink}
                            onChange={() => handleChangeInputFlavorful()}
                          />
                        </CCol>
                      </CRow>
                    )
                  case 'PH':
                    return (
                      <CRow className="mb-3" key={id}>
                        <CFormLabel htmlFor="PH" className="col-sm-2 col-form-label">
                          {param.param_nm}
                        </CFormLabel>
                        <CCol sm={5}>
                          <CInputGroup className="mb-3">
                            <CFormInput
                              type="text"
                              id="PH"
                              placeholder={param.param_nm}
                              {...register(`${param.param_nm}`, {
                                onChange: (e) => {
                                  handleInputValueStatus(param)
                                },
                              })}
                            />
                            <CInputGroupText id="basic-addon2">
                              {param.options[0].units}
                            </CInputGroupText>
                            {errors?.PH?.message ? (
                              <div className="error-form">{errors.PH?.message}</div>
                            ) : isPhOutOfStandar ? (
                              <div className="error-form">{`Nilai PH diluar standar`}</div>
                            ) : (
                              <div className="note-form">
                                {`Standar PH ada didalam range antara ${param.options[0].min_value} -${param.options[0].max_value}`}
                              </div>
                            )}
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    )
                  case 'Konsentrasi':
                    return (
                      <CRow className="mb-3" key={id}>
                        <CFormLabel htmlFor="Konsentrasi" className="col-sm-2 col-form-label">
                          {param.param_nm}
                        </CFormLabel>
                        <CCol sm={5}>
                          <CInputGroup className="mb-3">
                            <CFormInput
                              type="text"
                              id="Konsentrasi"
                              placeholder={param.param_nm}
                              {...register(`${param.param_nm}`, {
                                onChange: (e) => {
                                  handleInputValueStatus(param)
                                },
                              })}
                            />
                            <CInputGroupText id="basic-addon2">
                              {param.options[0].units}
                            </CInputGroupText>
                            {errors?.Konsentrasi?.message ? (
                              <div className="error-form">{errors.Konsentrasi?.message}</div>
                            ) : isKonsentrasiOutOfStandar ? (
                              <div className="error-form">{`Nilai Konsentrasi diluar standar`}</div>
                            ) : (
                              <div className="note-form">
                                {`Standar Konsentrasi ada didalam range antara ${param.options[0].min_value} -${param.options[0].max_value}`}
                              </div>
                            )}
                          </CInputGroup>
                        </CCol>
                      </CRow>
                    )
                  default:
                    return <div key={id} />
                }
              })}
          </CCardBody>
          <CCardFooter>
            <CRow className="mb-4">
              <CCol style={{ marginTop: '10px' }}>
                <CButton color={'primary'} type="submit" style={{ marginRight: '20px' }}>
                  simpan
                </CButton>
                <CButton color={'light'} onClick={() => navigate(-1)}>
                  batalkan
                </CButton>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
        {/* DRAINING */}
        <CCard color="white" className="mb-4">
          <CCardHeader>
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: '8px' }}>Draining Indikator</p>
              <CFormSwitch
                id="showIndikator"
                value={isShowIndikator}
                onChange={() => {
                  setIsShowIndikator(!isShowIndikator)
                }}
                size="large"
              />
            </div>
          </CCardHeader>
          <CCollapse visible={isShowIndikator}>
            {drainingFields.map((el, idField) => (
              <CCard color="white" key={idField}>
                <CCardBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="pic" className="col-sm-2 col-form-label">
                      Parameter yang
                    </CFormLabel>
                    <CCol md={5}>
                      <MultiSelect
                        value={el.parameter}
                        onChange={(e) => {
                          handleFormRepeaterChange(idField, e, 'parameter')
                        }}
                        options={cities}
                        optionLabel="name"
                        placeholder="Select Cities"
                        maxSelectedLabels={3}
                        // className="w-full"
                      />
                      {/* <CFormSelect
                        name="parameter"
                        value={el.parameter}
                        onChange={(e) => handleFormRepeaterChange(idField, e)}
                      >
                        <option value="select" disabled>
                          Silakan Pilih PIC
                        </option>
                        {employees.map((element, index) => (
                          <option value={element.employeeId} key={index}>
                            {element.name}
                          </option>
                        ))}
                      </CFormSelect>
                      <div className="error-form">{errors.employeeId?.message}</div> */}
                    </CCol>
                    <CCol>
                      <div style={{ position: 'absolute', right: '19px', top: '5px' }}>
                        <CButton
                          size="sm"
                          onClick={() => handleDeleteDrainingField(el.id)}
                          className="btn-close"
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <CTable>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">id</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tipe</CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                          Jumlah <sup>*Liter</sup>
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Biaya</CTableHeaderCell>
                        <CTableHeaderCell scope="col"></CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow>
                        {/* <CForm onSubmit={handleSubmit(onSubmit)}> */}
                        <CTableHeaderCell valign="middle">#</CTableHeaderCell>
                        <CTableDataCell>
                          <CFormSelect
                            name="tipeCairan"
                            onChange={(e) => handleFormRepeaterChange(idField, e)}
                            value={el.cairan.tipeCairan}
                          >
                            <option defaultValue="select" value="select">
                              --- Pilih Tipe ---
                            </option>
                            {drainingTypes.map((element, index) => (
                              <option value={element.id} key={index}>
                                {element.label}
                              </option>
                            ))}
                          </CFormSelect>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            name="totalCairan"
                            type="number"
                            id="type"
                            value={el.cairan.totalCairan}
                            onChange={(e) => handleFormRepeaterChange(idField, e)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            disabled
                            name="biaya"
                            type="number"
                            id="type"
                            value={el.cairan.biaya}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            disabled={el.cairan.totalCairan === 0 || !el.cairan.tipeCairan}
                            color="success"
                            onClick={() => handleAddIndikator(idField)}
                          >
                            <CIcon icon={cilPlus} style={{ color: 'white' }} />
                          </CButton>
                        </CTableDataCell>
                        {/* </CForm> */}
                      </CTableRow>
                      {el.listCairan.map((cairan, idListCairan) => (
                        <CTableRow key={idListCairan}>
                          <CTableHeaderCell>{idListCairan + 1}</CTableHeaderCell>
                          <CTableDataCell>{printTipeCairan(cairan.tipeCairan)}</CTableDataCell>
                          <CTableDataCell>{cairan.totalCairan}</CTableDataCell>
                          <CTableDataCell>{cairan.biaya}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              onClick={() => handleDelete(idField, cairan.id)}
                            >
                              <CIcon icon={cilTrash} style={{ color: 'white' }} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  {idField === drainingFields.length - 1 && (
                    <CButton color={'primary'} onClick={addDrainingFields}>
                      Tambah Indikator
                    </CButton>
                  )}
                </CCardBody>
              </CCard>
            ))}
          </CCollapse>
          {isShowIndikator && (
            <CCardFooter>
              <CRow className="mb-4">
                <CCol style={{ marginTop: '10px' }}>
                  <CButton color={'primary'} type="submit" style={{ marginRight: '20px' }}>
                    simpan
                  </CButton>
                  <CButton color={'light'} onClick={() => navigate(-1)}>
                    batalkan
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          )}
        </CCard>
      </CForm>
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
            openModal.type === 'check' ? 'Pengecekan' : 'Pengurasan'
          } Berhasil, Apakah anda mau melanjutkan ke proses ${
            openModal.type === 'check' ? 'Pengurasan' : 'Pengecekan'
          }?`}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() =>
              setOpenModal({
                show: false,
                type: '',
              })
            }
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

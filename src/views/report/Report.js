import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { useParams } from 'react-router-dom'

import id from 'date-fns/locale/id'
import { useSelector, shallowEqual } from 'react-redux'
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
} from '@coreui/react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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

const schema = yup
  .object({
    drainingTime: yup.string().required('Lama Pengurasan harus diisi'),
    checkDate: yup.string().required('Check Date harus diisi'),
    timeDate: yup.string().required('Time Date harus diisi'),
    employeeId: yup
      .string()
      .required('Karyawan harus dipilih')
      .notOneOf(['select'], 'PIC harus dipilih'),
    PH: yup.string().required('PH harus diisi'),
    banyakCairan: yup.string().required('Banyak cairan harus diisi'),
  })
  .required()

const Report = () => {
  const [checkDate, setCheckDate] = useState('')
  const [timeDate, setTimeDate] = useState('')
  const [visual, setVisual] = useState('putih')
  const [sludge, setSludge] = useState('sedang')
  const [drainingTime, setDrainingTime] = useState('')
  const [imagePrev, setImagePrev] = useState(UploadImagePlaceholder)
  const [employees, setEmployees] = useState(EmployeeData)
  const [selectedEmployee, setSelectedEmployee] = useState(EmployeeData)
  const [parameter, setParameter] = useState(FormParameter)
  let { machine_id, machine_name } = useParams()
  const { selectedMachine } = useSelector(
    ({ machineReducer }) => ({
      selectedMachine: machineReducer.selectedMachine,
    }),
    shallowEqual,
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'indikator',
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

  const handleChangeInputFlavorful = (form) => {
    console.log(form)
    const temp = [...parameter]

    let updateParam = temp.map((el) => (el.name === form.name ? { ...el, value: !el.value } : el))

    console.log(updateParam)
    setParameter(updateParam)
  }

  const imageDefault = (name) => {
    if (name === 'visual') {
      switch (visual) {
        case 'Coklat Tua':
          return Coktu
        case 'Putih Coklat':
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

  const handleChangeFileOption = (name, value) => {
    console.log(name)
    if (name === 'visual') {
      setVisual(value)
    } else {
      setSludge(value)
    }
  }

  const onSubmit = (data) => {
    console.log(data, '===')
  }

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
              <CFormLabel htmlFor="checkdate" className="col-sm-2 col-form-label">
                Check Date
              </CFormLabel>
              <CCol sm={5}>
                <Controller
                  control={control}
                  name="checkDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className={'form-control'}
                      placeholderText="dd/MM/yyyy"
                      id="checkdate"
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
                <div className="error-form">{errors.checkDate?.message}</div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="time" className="col-sm-2 col-form-label">
                Time
              </CFormLabel>
              <CCol md={5}>
                <Controller
                  control={control}
                  name="timeDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={timeDate}
                      onChange={(date) => setTimeDate(date)}
                      className={'form-control'}
                      placeholderText="time-date"
                      id="time"
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="hh:mm"
                      locale={id}
                    />
                  )}
                />
                <div className="error-form">{errors.timeDate?.message}</div>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="drainingTime" className="col-sm-2 col-form-label">
                Lama Pengerjaan
              </CFormLabel>
              <CCol sm={5}>
                <CFormInput
                  type="text"
                  id="drainingTime"
                  placeholder="Masukkan Lama Pengerjaan"
                  {...register('drainingTime')}
                />
                <div className="error-form">{errors.drainingTime?.message}</div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard color="white">
          <CCardHeader>Parameter</CCardHeader>
          <CCardBody>
            {parameter.map((form, index) => {
              switch (form.inputType) {
                case 'text':
                  return (
                    <CRow className="mb-3" key={index}>
                      <CFormLabel htmlFor={form.value} className="col-sm-2 col-form-label">
                        {form.label}
                      </CFormLabel>
                      <CCol sm={5}>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            type="text"
                            id={form.value}
                            placeholder={form.placeholder}
                            {...register(`${form.value}`)}
                          />
                          {form.unit && (
                            <CInputGroupText id="basic-addon2">{form.unit}</CInputGroupText>
                          )}
                        </CInputGroup>
                        <div className="error-form">{errors[form.value]?.message}</div>
                      </CCol>
                    </CRow>
                  )
                case 'info':
                  return (
                    <CRow className="mb-3" key={index}>
                      <CFormLabel htmlFor={form.value} className="col-sm-2 col-form-label">
                        {form.label}
                      </CFormLabel>
                      <CCol sm={5}>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            type="text"
                            id={form.value}
                            placeholder={form.placeholder}
                            disabled
                          />
                          {form.unit && (
                            <CInputGroupText id="basic-addon2">{form.unit}</CInputGroupText>
                          )}
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  )
                case 'options':
                  return (
                    <CRow className="mb-3" key={index}>
                      <CFormLabel htmlFor="typeChemical" className="col-sm-2 col-form-label">
                        {form.label}
                      </CFormLabel>
                      <CCol sm={5}>
                        <CFormSelect aria-label="Default select example" value={form.value}>
                          <option selected disabled>
                            -- select type --
                          </option>
                          {form.optionList.map((list, index) => (
                            <option value={list.id} key={index}>
                              {list.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  )
                case 'toogle':
                  return (
                    <CRow className="mb-3" key={index}>
                      <CFormLabel className="col-sm-2 col-form-label">{form.label}</CFormLabel>
                      <CCol sm={5}>
                        <CFormSwitch
                          label={form.value ? form.trueLabel : form.falseLabel}
                          id="formSwitchCheckChecked"
                          value={form.value}
                          onChange={() => handleChangeInputFlavorful(form)}
                          size="large"
                        />
                      </CCol>
                    </CRow>
                  )
                case 'file':
                  return (
                    <div key={index} style={{ display: 'flex', marginTop: '30px' }}>
                      <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                        {form.label}
                      </CFormLabel>
                      <div>
                        <CTable>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell scope="col">Acuan</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            <CTableRow>
                              <CTableDataCell>
                                <img
                                  src={imageDefault(form.label)}
                                  alt=""
                                  style={{ height: '200px', width: '200px', marginRight: '30px' }}
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
                      </div>
                      <div>
                        <CTable>
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
                                  style={{ height: '200px', width: '200px', marginRight: '30px' }}
                                />
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        {form.optionList.map((el, index) => (
                          <CFormCheck
                            defaultChecked={index === 0}
                            type="radio"
                            value={el.name}
                            name={form.value}
                            label={el.name}
                            key={index}
                            onChange={(e) => handleChangeFileOption(form.value, e.target.value)}
                          />
                        ))}
                      </div>
                    </div>
                  )

                default:
                  return null
              }
            })}
            <CRow>
              <CCol style={{ marginTop: '30px' }}>
                <CButton color={'primary'} type="submit" style={{ marginRight: '20px' }}>
                  simpan
                </CButton>
                <CButton color={'light'}>batalkan</CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CForm>
    </CCol>
  )
}

export default Report

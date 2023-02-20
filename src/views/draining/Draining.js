import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import id from 'date-fns/locale/id'
import {
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CForm,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import EmployeeData from '../../assets/json/employee.json'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilTrash } from '@coreui/icons'

const drainingTypes = [
  {
    id: '0',
    value: 'solar',
    label: 'Solar',
  },
  {
    id: '1',
    value: 'pertamax',
    label: 'Pertamax',
  },
  {
    id: '2',
    value: 'pertalite',
    label: 'Pertalite',
  },
  {
    id: '3',
    value: 'pelumas',
    label: 'Pelumas',
  },
]

const schema = yup
  .object({
    drainingTime: yup.string().required('Lama Pengurasan harus diisi'),
    checkDate: yup.string().required('Check Date harus diisi'),
    timeDate: yup.string().required('Time Date harus diisi'),
    employeeId: yup
      .string()
      .required('Karyawan harus dipilih')
      .notOneOf(['select'], 'PIC harus dipilih'),
  })
  .required()

const Draining = () => {
  const [type, setType] = useState('')
  const [jumlah, setJumlah] = useState(0)
  const [employees, setEmployees] = useState(EmployeeData)
  const [selectedEmployee, setSelectedEmployee] = useState(EmployeeData)
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
  let { machine_name } = useParams()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleSelectOptionsType = (e) => {
    const filterData = drainingTypes.filter((el) => el.id === e.target.value)[0]
    if (!filterData) return

    console.log(filterData, 'filterData')
    setType(filterData.id)
  }

  const onSubmit = (data) => {
    console.log(data, '===')
  }

  const handleDelete = (id) => {
    let duplicate = [...dataDraining]
    duplicate.splice(
      duplicate.findIndex((el) => el.id === id),
      1,
    )
    setDataDraining(duplicate)
  }

  const handleAddIndikator = () => {
    let duplicate = [...dataDraining]

    const newData = {
      id: dataDraining.length,
      tipe: drainingTypes.filter((el) => el.id === type)[0].label,
      jumlah,
    }

    duplicate.push(newData)
    setDataDraining(duplicate)
    setType('')
    setJumlah(0)
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
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
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
                Lama Pengurasan
              </CFormLabel>
              <CCol sm={5}>
                <CFormInput
                  type="number"
                  id="drainingTime"
                  placeholder="Masukkan Lama Pengurasan"
                  {...register('drainingTime')}
                />
                <div className="error-form">{errors.drainingTime?.message}</div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard color="white">
          <CCardHeader>Draining Indikator</CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tipe</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Jumlah <sup>*Liter</sup>
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  {/* <CForm onSubmit={handleSubmit(onSubmit)}> */}
                  <CTableHeaderCell valign="middle">#</CTableHeaderCell>
                  <CTableDataCell>
                    <CFormSelect onChange={handleSelectOptionsType} value={type}>
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
                      type="number"
                      id="type"
                      value={jumlah}
                      onChange={(e) => setJumlah(e.target.value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      disabled={jumlah === 0 || !type}
                      color="success"
                      onClick={handleAddIndikator}
                    >
                      <CIcon icon={cilPlus} style={{ color: 'white' }} />
                    </CButton>
                  </CTableDataCell>
                  {/* </CForm> */}
                </CTableRow>
                {dataDraining.map((el, idx) => (
                  <CTableRow key={idx}>
                    <CTableHeaderCell>{idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{el.tipe}</CTableDataCell>
                    <CTableDataCell>{el.jumlah}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" onClick={() => handleDelete(el.id)}>
                        <CIcon icon={cilTrash} style={{ color: 'white' }} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CRow>
              <CCol style={{ marginTop: '30px' }}>
                <CButton color={'primary'} style={{ marginRight: '20px' }} type="submit">
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

export default Draining

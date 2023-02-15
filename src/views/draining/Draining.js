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
  // CFormSwitch,
  // CFormCheck,
  // CInputGroupText,
  // CInputGroup,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  // CCardFooter,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import UploadImagePlaceholder from '../../assets/images/Placeholder.jpg'
import EmployeeData from '../../assets/json/employee.json'
import FormParameter from '../../assets/json/form-parameter.json'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

const Report = () => {
  const [checkDate, setCheckDate] = useState('')
  const [timeDate, setTimeDate] = useState('')
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

  return (
    <CCol xs={12}>
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
              <CFormSelect
                aria-label="Default select example"
                onChange={handleSelectOptionsEmployee}
              >
                <option value="1" selected disabled>
                  Select your option
                </option>
                {employees.map((element, index) => (
                  <option value={element.employeeId} key={index}>
                    {element.name}
                  </option>
                ))}
              </CFormSelect>
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
              <DatePicker
                selected={checkDate}
                onChange={(date) => setCheckDate(date)}
                className={'form-control'}
                placeholderText="dd/MM/yyyy"
                id="checkdate"
                dateFormat="dd/MM/yyyy"
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="time" className="col-sm-2 col-form-label">
              Time
            </CFormLabel>
            <CCol md={5}>
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
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="drainingTime" className="col-sm-2 col-form-label">
              Lama Pengurasan
            </CFormLabel>
            <CCol sm={5}>
              <CFormInput
                type="text"
                id="drainingTime"
                value={drainingTime}
                placeholder="Masukkan Lama Pengurasan"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard color="white">
        <CCardHeader>Draining Indikator</CCardHeader>
        <CCardBody>
          <CButton size="sm">
            <CIcon icon={cilPlus} />
          </CButton>
          <div style={{ marginBottom: '20px' }} />
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tipe</CTableHeaderCell>
                <CTableHeaderCell scope="col">Jumlah</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableHeaderCell>1</CTableHeaderCell>
                <CTableHeaderCell>Cylinder Head</CTableHeaderCell>
                <CTableDataCell>20 Liter</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell>2</CTableHeaderCell>
                <CTableHeaderCell>Cylinder Head</CTableHeaderCell>
                <CTableDataCell>15 Liter</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          <CRow>
            <CCol style={{ marginTop: '30px' }}>
              <CButton color={'primary'} style={{ marginRight: '20px' }}>
                simpan
              </CButton>
              <CButton color={'light'}>batalkan</CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default Report

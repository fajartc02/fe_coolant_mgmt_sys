import React, { useState } from 'react'
import DatePicker from 'react-datepicker'

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
  // CCardFooter,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import UploadImagePlaceholder from '../../assets/images/Placeholder.jpg'
import EmployeeData from './employee.json'

// const formParameterContent = [
//   {
//     fieldKey: 'input',
//     placeholder: 'hahaha',
//     inputType: 'number',
//     options: [],
//     label: 'PH',
//   },
//   {
//     fieldKey: 'input',
//     placeholder: '',
//     inputType: 'text',
//     options: [],
//   },
// ]

const Report = () => {
  const [checkDate, setCheckDate] = useState('')
  const [timeDate, setTimeDate] = useState('')
  const [imagePrev, setImagePrev] = useState(UploadImagePlaceholder)
  const [employees, setEmployees] = useState(EmployeeData)
  const [selectedEmployee, setSelectedEmployee] = useState(EmployeeData)

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

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="PH" className="col-sm-2 col-form-label">
              Machine Name
            </CFormLabel>
            <CCol sm={5}>
              <CFormInput type="text" id="PH" value={selectedMachine.machineName} disabled />
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
                style={{ border: '0.5px solid #c4c9d0' }}
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
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Parameter</CCardHeader>
        <CCardBody>
          <CCol>
            <CRow className="mb-3">
              <CFormLabel htmlFor="aroma" className="col-sm-2 col-form-label">
                Aroma
              </CFormLabel>
              <CCol sm={5}>
                <CFormCheck type="radio" name="aroma" id="flexRadioDefault1" label="Bau" />
                <CFormCheck
                  type="radio"
                  name="aroma"
                  id="flexRadioDefault2"
                  label="Tidak Bau"
                  defaultChecked
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="PH" className="col-sm-2 col-form-label">
                PH
              </CFormLabel>
              <CCol sm={5}>
                <CFormInput type="text" id="PH" />
              </CCol>
            </CRow>
          </CCol>
          <CRow className="mb-3">
            <CFormLabel htmlFor="PH" className="col-sm-2 col-form-label">
              PH Status
            </CFormLabel>
            <CCol sm={5}>
              <CFormInput type="text" id="PH" disabled value="kurang" />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
              Life Time Chemical
            </CFormLabel>
            <CCol sm={5}>
              <CFormInput type="text" id="lifeTime" />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="addChemical" className="col-sm-2 col-form-label">
              Add More Chemical
            </CFormLabel>
            <CCol sm={5}>
              <CFormSwitch label="Add More Chemical" id="formSwitchCheckChecked" defaultChecked />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="typeChemical" className="col-sm-2 col-form-label">
              Type of Chemical
            </CFormLabel>
            <CCol sm={5}>
              <CFormSelect aria-label="Default select example">
                <option>-- select type --</option>
                <option value="1">pertamax</option>
                <option value="2">solar</option>
                <option value="3">pertalite</option>
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
              Banyak Cairan
            </CFormLabel>
            <CCol sm={5}>
              <CInputGroup className="mb-3">
                <CFormInput type="text" id="lifeTime" />
                <CInputGroupText id="basic-addon2">liter</CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <div style={{ display: 'flex' }}>
              <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                Visual
              </CFormLabel>
              <img
                src={UploadImagePlaceholder}
                alt=""
                style={{ height: '200px', width: '200px', marginRight: '30px' }}
              />
              <input
                type="file"
                id="imageInpt"
                style={{ display: 'none' }}
                onChange={handleOnChangeImage}
              />
              <label htmlFor="imageInpt">
                <img
                  src={imagePrev}
                  alt="uploadedImage"
                  id="uploadedImage"
                  style={{ height: '200px', width: '200px', marginRight: '30px' }}
                />
              </label>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <CFormCheck type="radio" name="colorVisual" label="Putih" />
                <CFormCheck type="radio" name="colorVisual" label="Putih Coklat" />
                <CFormCheck type="radio" name="colorVisual" label="Coklat" />
                <CFormCheck type="radio" name="colorVisual" label="Coklat Tua" />
              </div>
            </div>
          </CRow>
          <CRow>
            <div style={{ display: 'flex', marginTop: '30px' }}>
              <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                Sludge
              </CFormLabel>
              <img
                src={UploadImagePlaceholder}
                alt=""
                style={{ height: '200px', width: '200px', marginRight: '30px' }}
              />
              <input
                type="file"
                id="imageInpt"
                style={{ display: 'none' }}
                onChange={handleOnChangeImage}
              />
              <label htmlFor="imageInpt">
                <img
                  src={imagePrev}
                  alt="uploadedImage"
                  id="uploadedImage"
                  style={{ height: '200px', width: '200px', marginRight: '30px' }}
                />
              </label>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <CFormCheck type="radio" name="sludgeVisual" label="Normal" />
                <CFormCheck type="radio" name="sludgeVisual" label="Tidak Normal" />
              </div>
            </div>
          </CRow>
          <CRow>
            <CCol style={{ marginTop: '30px' }}>
              {/* <CFormLabel className="col-sm-3 col-form-label" /> */}
              <CButton color={'primary'} style={{ marginRight: '20px' }}>
                simpan
              </CButton>
              <CButton color={'light'}>batalkan</CButton>
            </CCol>
          </CRow>
        </CCardBody>
        {/* <CCardFooter style={{ marginTop: '20px' }} color="info">
          
        </CCardFooter> */}
      </CCard>
    </CCol>
  )
}

export default Report

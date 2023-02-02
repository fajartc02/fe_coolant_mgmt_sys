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
import EmployeeData from '../../assets/json/employee.json'
import FormParameter from '../../assets/json/form-parameter.json'

const Report = () => {
  const [checkDate, setCheckDate] = useState('')
  const [timeDate, setTimeDate] = useState('')
  const [isFlavorful, setIsFlavorful] = useState(false)
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

  const handleChangeInputFlavorful = (e) => {
    setIsFlavorful(e.target.checked)
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
          {FormParameter.map((form, index) => {
            switch (form.inputType) {
              case 'text':
                return (
                  <CRow className="mb-3" key={index}>
                    <CFormLabel htmlFor={form.value} className="col-sm-2 col-form-label">
                      {form.label}
                    </CFormLabel>
                    <CCol sm={5}>
                      <CInputGroup className="mb-3">
                        <CFormInput type="text" id={form.value} placeholder={form.placeholder} />
                        {form.unit && (
                          <CInputGroupText id="basic-addon2">{form.unit}</CInputGroupText>
                        )}
                      </CInputGroup>
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
                      <CFormSelect aria-label="Default select example">
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
                    <CFormLabel htmlFor="aroma" className="col-sm-2 col-form-label">
                      {form.label}
                    </CFormLabel>
                    <CCol sm={5}>
                      <CFormSwitch
                        label={isFlavorful ? form.trueLabel : form.falseLabel}
                        id="formSwitchCheckChecked"
                        value={isFlavorful}
                        onChange={handleChangeInputFlavorful}
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
                      {form.optionList.map((el, index) => (
                        <CFormCheck type="radio" name={form.value} label={el.name} key={index} />
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

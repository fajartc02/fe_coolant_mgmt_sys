import React from 'react'
import PropTypes, { instanceOf, object } from 'prop-types'
import DatePicker from 'react-datepicker'
import { useParams } from 'react-router-dom'

import id from 'date-fns/locale/id'
import {
  CCol,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCard,
  CCardBody,
  CButton,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

const MainForm = ({
  employees,
  handleSelectEmployee,
  selectedEmployee,
  setStartDate,
  startDate,
  setStartTime,
  startTime,
  setEndDate,
  endDate,
  setEndTime,
  endTime,
  isActive,
}) => {
  let { machine_name } = useParams()

  return (
    <CCard className="mb-4" color="white">
      <CCardBody>
        <CRow className="mb-3">
          <CFormLabel htmlFor="machineName" className="col-sm-2 col-form-label">
            Machine Id
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
              onChange={(e) => handleSelectEmployee(e)}
              value={selectedEmployee.employeeId}
              disabled={!isActive}
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
          <CFormLabel htmlFor="startDate" className="col-sm-2 col-form-label">
            Start Date
          </CFormLabel>
          <CCol sm="3">
            <DatePicker
              disabled={!isActive}
              selected={startDate.value}
              onFocus={() =>
                setStartDate({
                  isError: false,
                  errorMessage: '',
                })
              }
              onChange={(date) =>
                setStartDate({
                  ...startDate,
                  value: date,
                })
              }
              className={'form-control'}
              placeholderText="dd/MM/yyyy"
              id="startDate"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
            />
            {startDate.isError && <div className="error-form">{startDate?.errorMessage}</div>}
          </CCol>
          <CCol sm="2">
            <DatePicker
              disabled={!isActive}
              selected={startTime.value}
              onFocus={() =>
                setStartTime({
                  isError: false,
                  errorMessage: '',
                })
              }
              onChange={(date) =>
                setStartTime({
                  ...startTime,
                  value: date,
                })
              }
              className={'form-control'}
              placeholderText="HH:mm"
              id="startTime"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={1}
              timeCaption="Time"
              dateFormat="HH:mm"
              locale={id}
              minTime={new Date()}
              maxTime={new Date().setHours(23, 59, 59)}
            />
            {startTime.isError && <div className="error-form">{startTime?.errorMessage}</div>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel htmlFor="endDate" className="col-sm-2 col-form-label">
            End Date
          </CFormLabel>
          <CCol sm="3">
            <DatePicker
              selected={endDate.value}
              onFocus={() =>
                setEndDate({
                  isError: false,
                  errorMessage: '',
                })
              }
              onChange={(date) =>
                setEndDate({
                  ...endDate,
                  value: date,
                })
              }
              className={'form-control'}
              placeholderText="dd/MM/yyyy"
              id="endDate"
              dateFormat="dd/MM/yyyy"
              disabled={!startDate.value || !isActive}
              minDate={startDate.value}
            />
            {endDate.isError && <div className="error-form">{endDate?.errorMessage}</div>}
          </CCol>
          <CCol sm="2">
            <DatePicker
              selected={endTime.value}
              onFocus={() =>
                setEndTime({
                  isError: false,
                  errorMessage: '',
                })
              }
              onChange={(date) =>
                setEndTime({
                  ...endTime,
                  value: date,
                })
              }
              className={'form-control'}
              id="time"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={1}
              timeCaption="Time"
              dateFormat="HH:mm"
              locale={id}
              disabled={!startTime.value || !isActive}
              placeholderText="HH:mm"
              minTime={new Date(startTime.value).getTime() + 1 * 60 * 1000}
              maxTime={new Date().setHours(23, 59, 59)}
            />
            {endTime.isError && <div className="error-form">{endTime?.errorMessage}</div>}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

MainForm.propTypes = {
  employees: PropTypes.array,
  isActive: PropTypes.bool,
  startDate: PropTypes.oneOfType([object, instanceOf(Date)]),
  startTime: PropTypes.oneOfType([object, instanceOf(Date)]),
  endDate: PropTypes.oneOfType([object, instanceOf(Date)]),
  endTime: PropTypes.oneOfType([object, instanceOf(Date)]),
  selectedEmployee: PropTypes.object,
  setStartDate: PropTypes.func,
  setStartTime: PropTypes.func,
  setEndDate: PropTypes.func,
  setEndTime: PropTypes.func,
  handleSelectEmployee: PropTypes.func,
}

export default MainForm

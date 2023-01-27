import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
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
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

const Report = () => {
  const [checkDate, setCheckDate] = useState('')
  const [timeDate, setTimeDate] = useState('')
  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <CRow className="mb-3">
            <CFormLabel htmlFor="pic" className="col-sm-2 col-form-label">
              PIC
            </CFormLabel>
            <CCol sm={5}>
              <CFormSelect aria-label="Default select example">
                <option>-- select PIC --</option>
                <option value="1">Fajar</option>
                <option value="2">Tri</option>
                <option value="3">Cahyono</option>
              </CFormSelect>
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
                placeholderText="check-date"
                id="checkdate"
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CFormLabel htmlFor="time" className="col-sm-2 col-form-label">
              Time
            </CFormLabel>
            <CCol sm={5}>
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
                locale="id-ID"
              />
            </CCol>
          </CRow>
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
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default Report

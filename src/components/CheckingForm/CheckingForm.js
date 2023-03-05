import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCardFooter,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import Coktu from '../../assets/images/coktu.png'
import Cok from '../../assets/images/cok.png'
import PutCok from '../../assets/images/putcok.png'
import Putih from '../../assets/images/putih.png'
import Sedang from '../../assets/images/sedang.png'
import Banyak from '../../assets/images/banyak.png'
import Sedikit from '../../assets/images/sedikit.png'

// API
import CIcon from '@coreui/icons-react'

import { cilCheckCircle, cilWarning, cilXCircle } from '@coreui/icons'

const CheckingForm = ({
  parametersForm,
  handleSubmitCheckingForm,
  dynamicEl,
  dynamicElIdPosition,
  handleOnChangeFormChecking,
  handleOnFocusFormChecking,
}) => {
  const navigate = useNavigate()
  const [screenSize, setScreenSize] = useState(false)

  useLayoutEffect(() => {
    function updateSize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const { fields, isActive } = dynamicEl

  const imageDefault = (name, value) => {
    if (name === 'Visual') {
      switch (value) {
        case 1:
          return Putih
        case 2:
          return PutCok
        case 3:
          return Cok
        default:
          return Coktu
      }
    } else {
      switch (value) {
        case 9:
          return Sedikit
        case 8:
          return Sedang
        default:
          return Banyak
      }
    }
  }

  const formOptionsNote = (options, value, paramName) => {
    if (!value) return

    const filtered = options.filter((el) => el.option_id === Number(value))[0]
    if (filtered?.rule_lvl === 1) {
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
    } else if (filtered?.rule_lvl === 2) {
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
            style={{ color: '#ffbb00', marginRight: '5px', marginTop: '2px' }}
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

  const handleInputValueStatus = (min, max, value) => {
    if (value && (Number(value) < min || Number(value) > max)) {
      return true
    }
    return false
  }

  const handleLabelAroma = (value, param) => {
    let result = ''
    if (value) {
      result = param.filter((e) => e.option_id === 5)[0]
    } else {
      result = param.filter((e) => e.option_id === 6)[0]
    }

    return result.opt_nm
  }

  return (
    <CCard color="white" className="mb-4">
      <CCardHeader>Parameter</CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CFormLabel htmlFor="PH" className="col-sm-2 col-form-label">
            Checkseet List
          </CFormLabel>
          <CCol sm={5}>
            <CFormSelect
              disabled={
                dynamicEl?.checkingMaintenanceList?.length === 0 ||
                !isActive ||
                dynamicEl?.selectedCheckMaintenance
              }
              name="checkingMaintenanceList"
              onChange={(e) => {
                handleOnChangeFormChecking(dynamicElIdPosition, e)
              }}
              value={dynamicEl?.selectedCheckMaintenance}
            >
              <option defaultValue="select" value="select">
                --- Pilih Checkseet ---
              </option>
              {dynamicEl?.checkingMaintenanceList?.map((element, index) => (
                <option value={element.checksheet_id} key={index}>
                  {element.maintenance_nm}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>
        {dynamicEl?.paramRender?.[0]?.parameters?.map((param, id) => {
          switch (param.param_nm) {
            case 'Sludge':
              return (
                <div key={id}>
                  <div style={{ display: screenSize <= 768 ? 'block' : 'flex', marginTop: '30px' }}>
                    <CFormLabel className="col-sm-2 col-form-label">{param.param_nm}</CFormLabel>
                    <div className="table-responsive">
                      <CTable className="mx-auto w-auto">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col" className="align-midle text-center">
                              Acuan
                            </CTableHeaderCell>

                            <CTableHeaderCell className="align-midle">&nbsp;</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell>
                              <img
                                src={imageDefault(param.param_nm, fields[0].Sludge.value)}
                                alt=""
                                style={{
                                  height: '200px',
                                  width: '200px',
                                  margin: 'auto',
                                }}
                              />
                            </CTableDataCell>
                            <CTableDataCell className="align-middle">
                              {param.options.map((el, index) => (
                                <CFormCheck
                                  disabled={!isActive}
                                  // defaultChecked={index === 0}
                                  type="radio"
                                  value={el.option_id}
                                  name={param.param_nm}
                                  label={el.opt_nm}
                                  key={`${index}-${dynamicElIdPosition}`}
                                  id={`${index}-${dynamicElIdPosition}`}
                                  onChange={(e) =>
                                    handleOnChangeFormChecking(dynamicElIdPosition, e, {
                                      ...el,
                                      ...param,
                                    })
                                  }
                                />
                              ))}
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                  <CRow>
                    {fields[0].Sludge.isError ? (
                      <CCol
                        md={{ offset: 2 }}
                        style={{
                          marginTop: '-10px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div className="error-form">{fields[0].Sludge.errorMessage}</div>
                      </CCol>
                    ) : (
                      formOptionsNote(param.options, fields[0].Sludge.value, 'Sludge')
                    )}
                  </CRow>
                </div>
              )
            case 'Visual':
              return (
                <div key={id}>
                  <div style={{ display: screenSize <= 768 ? 'block' : 'flex', marginTop: '30px' }}>
                    <CFormLabel htmlFor="lifeTime" className="col-sm-2 col-form-label">
                      {param.param_nm}
                    </CFormLabel>
                    <div className="table-responsive">
                      <CTable className="mx-auto w-auto">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col" className="text-center">
                              Acuan
                            </CTableHeaderCell>

                            <CTableHeaderCell className="align-midle text-center">
                              &nbsp;
                            </CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow>
                            <CTableDataCell>
                              <img
                                src={imageDefault(param.param_nm, fields[0].Visual.value)}
                                alt=""
                                style={{
                                  height: '200px',
                                  width: '200px',
                                  margin: 'auto',
                                }}
                              />
                            </CTableDataCell>

                            <CTableDataCell className="align-middle">
                              {param.options.map((el, index) => (
                                <CFormCheck
                                  disabled={!isActive}
                                  type="radio"
                                  value={el.option_id}
                                  name={param.param_nm}
                                  label={el.opt_nm}
                                  key={`${index}-${dynamicElIdPosition}`}
                                  id={`${index}-${dynamicElIdPosition}`}
                                  onChange={(e) =>
                                    handleOnChangeFormChecking(dynamicElIdPosition, e, {
                                      ...el,
                                      ...param,
                                    })
                                  }
                                />
                              ))}
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </div>
                  </div>
                  <CRow>
                    {fields[0].Visual.isError ? (
                      <CCol
                        md={{ offset: 2 }}
                        style={{
                          marginTop: '-10px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div className="error-form">{fields[0].Visual.errorMessage}</div>
                      </CCol>
                    ) : (
                      formOptionsNote(param.options, fields[0].Visual.value, 'Visual')
                    )}
                  </CRow>
                </div>
              )
            case 'Aroma':
              return (
                <CRow className="mb-3" key={id}>
                  <CFormLabel className="col-sm-2 col-form-label">{param.param_nm}</CFormLabel>
                  <CCol sm={5} style={{ paddingTop: '7px' }}>
                    <CFormSwitch
                      disabled={!isActive}
                      defaultChecked={fields[0].isStink.value}
                      name="isStink"
                      label={handleLabelAroma(fields[0].isStink.value, param.options)}
                      id="formSwitchCheckChecked"
                      value={fields[0].isStink.value}
                      onChange={(e) =>
                        handleOnChangeFormChecking(dynamicElIdPosition, e, {
                          ...param,
                          ...(fields[0].isStink.value ? param.options[0] : param.options[1]),
                        })
                      }
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
                        disabled={!isActive}
                        type="text"
                        id="PH"
                        placeholder={param.param_nm}
                        name="PH"
                        value={
                          dynamicEl.isFilled ? param.options[0].task_value : fields[0].PH.value
                        }
                        onChange={(e) => {
                          handleOnChangeFormChecking(dynamicElIdPosition, e, {
                            ...param,
                            ...param.options[0],
                          })
                          handleOnFocusFormChecking(dynamicElIdPosition, 'PH')
                        }}
                      />
                      <CInputGroupText id="basic-addon2">{param.options[0].units}</CInputGroupText>
                      {fields[0].PH.isError ? (
                        <div className="error-form">{fields[0].PH.errorMessage}</div>
                      ) : handleInputValueStatus(
                          param.options[0].min_value,
                          param.options[0].max_value,
                          dynamicEl.isFilled ? param.options[0].task_value : fields[0].PH.value,
                        ) ? (
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
                        disabled={!isActive}
                        type="text"
                        id="Konsentrasi"
                        placeholder={param.param_nm}
                        name="Konsentrasi"
                        value={
                          dynamicEl.isFilled
                            ? param.options[0].task_value
                            : fields[0].Konsentrasi.value
                        }
                        onChange={(e) => {
                          handleOnChangeFormChecking(dynamicElIdPosition, e, {
                            ...param,
                            ...param.options[0],
                          })
                          handleOnFocusFormChecking(dynamicElIdPosition, 'Konsentrasi')
                        }}
                      />
                      <CInputGroupText id="basic-addon2">{param.options[0].units}</CInputGroupText>
                      {fields[0].Konsentrasi.isError ? (
                        <div className="error-form">{fields[0].Konsentrasi.errorMessage}</div>
                      ) : handleInputValueStatus(
                          param.options[0].min_value,
                          param.options[0].max_value,
                          dynamicEl.isFilled
                            ? param.options[0].task_value
                            : fields[0].Konsentrasi.value,
                        ) ? (
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
            <CButton
              disabled={!isActive}
              color={'primary'}
              type="submit"
              style={{ marginRight: '20px' }}
              onClick={() => handleSubmitCheckingForm(dynamicElIdPosition)}
            >
              simpan
            </CButton>
            <CButton color={'light'} onClick={() => navigate(-1)} disabled={!isActive}>
              batalkan
            </CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  )
}

CheckingForm.propTypes = {
  parametersForm: PropTypes.array,
  dynamicElIdPosition: PropTypes.number,
  handleSubmitCheckingForm: PropTypes.func,
  handleOnChangeFormChecking: PropTypes.func,
  handleOnFocusFormChecking: PropTypes.func,
  dynamicEl: PropTypes.object,
}

export default CheckingForm

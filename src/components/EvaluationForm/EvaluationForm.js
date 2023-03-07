import React, { useState, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { MultiSelect } from 'primereact/multiselect'

import {
  CCol,
  CFormInput,
  CFormSelect,
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
  CFormLabel,
  CCardFooter,
  CFormTextarea,
  CFormCheck,
  CFormSwitch,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilPen, cilPlus, cilTrash, cilWarning, cilXCircle } from '@coreui/icons'

import Coktu from 'src/assets/images/coktu.png'
import Cok from 'src/assets/images/cok.png'
import PutCok from 'src/assets/images/putcok.png'
import Putih from 'src/assets/images/putih.png'
import Sedang from 'src/assets/images/sedang.png'
import Banyak from 'src/assets/images/banyak.png'
import Sedikit from 'src/assets/images/sedikit.png'

const EvaluationForm = ({
  handleOnFocusFormChecking,
  handleDeleteRowFormEval,
  handleAddingLiquidFormEvaluation,
  handleEditLiquidFormEval,
  handleEditLiquidDoneFormEval,
  handleEditDrainingFormEvaluation,
  maintenanceData,
  // drainingFields,
  dynamicElIdPosition,
  handleChangeFormEvaluation,
  printTipeCairan,
  parameters,
  handleDeleteDrainingField,
  addFormEvalField,
  handleSubmitFormEvaluation,
  dynamicEl,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fields, isActive, paramRender } = dynamicEl
  const isDrainingPage = location.pathname.indexOf('/draining/') !== -1

  const [screenSize, setScreenSize] = useState(false)

  useLayoutEffect(() => {
    function updateSize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])

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

    const filtered = options.filter((el) => el.option_id === value)[0]
    if (filtered?.rule_lvl === 1) {
      return (
        <CCol
          md={{ offset: 2 }}
          style={{
            marginTop: '-10px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
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
            marginBottom: '5px',
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
            marginBottom: '5px',
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

  const filterParamRender = (paramMaster, selectedParam) => {
    console.log(selectedParam, ' selectedParam')
    const filtered = paramMaster?.filter((el) => {
      return selectedParam.some((f) => {
        return f.param_id === el.param_id
      })
    })
    return filtered
  }

  return (
    <>
      <CCard color="white" className="mb-4">
        <CCardHeader>Draining Indikator Evaluasi</CCardHeader>
        {fields.map((drainingField, idField) => (
          <CCard color="white" key={idField}>
            <CCardBody>
              <CCard className="mb-4" color="white">
                <CCardBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="pic" className="col-md-3 col-form-label">
                      Parameter yang akan diperbaiki
                    </CFormLabel>
                    <CCol md={5}>
                      <MultiSelect
                        // disabled={!isActive}
                        // value={drainingField.parameter.value}
                        disabled={true}
                        value={drainingField.oosParam}
                        onChange={(e) => {
                          handleChangeFormEvaluation(dynamicElIdPosition, idField, e, 'parameter')
                        }}
                        options={drainingField.oosParam}
                        optionLabel="name"
                        placeholder="Silakan Pilih"
                        maxSelectedLabels={6}
                      />
                      {drainingField?.isErrorParameter && (
                        <div className="error-form">{drainingField?.errorMessageParameter}</div>
                      )}
                    </CCol>
                    <CCol>
                      <div style={{ position: 'absolute', right: '19px', top: '5px' }}>
                        <CButton
                          disabled={!isActive}
                          size="sm"
                          onClick={() =>
                            handleDeleteDrainingField(dynamicElIdPosition, drainingField.id)
                          }
                          className="btn-close"
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <CCardHeader>Tambahkan Cairan Untuk Perbaikan</CCardHeader>
                  <div className="table-responsive">
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
                          <CTableHeaderCell valign="middle">#</CTableHeaderCell>
                          <CTableDataCell>
                            <CFormSelect
                              disabled={!isActive}
                              name="tipeCairan"
                              onChange={(e) => {
                                handleChangeFormEvaluation(dynamicElIdPosition, idField, e)
                              }}
                              value={drainingField.cairan.tipeCairan}
                            >
                              <option defaultValue="select" value="select">
                                --- Pilih Tipe ---
                              </option>
                              {maintenanceData?.chemicals?.map((element, index) => (
                                <option value={element.chemical_id} key={index}>
                                  {element.chemical_nm}
                                </option>
                              ))}
                            </CFormSelect>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              disabled={!isActive}
                              name="totalCairan"
                              type="number"
                              id="type"
                              value={drainingField.cairan.totalCairan}
                              onChange={(e) =>
                                handleChangeFormEvaluation(dynamicElIdPosition, idField, e)
                              }
                              min="0"
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormInput
                              disabled
                              name="biaya"
                              type="text"
                              id="type"
                              value={new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                              }).format(Number(drainingField.cairan.biaya))}
                            />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              disabled={
                                drainingField.cairan.totalCairan === 0 ||
                                !drainingField.cairan.tipeCairan ||
                                !isActive
                              }
                              color="success"
                              onClick={() =>
                                handleAddingLiquidFormEvaluation(dynamicElIdPosition, idField)
                              }
                            >
                              <CIcon icon={cilPlus} style={{ color: 'white' }} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                        {drainingField?.listCairan?.value.map((cairan, idListCairan) => {
                          if (cairan.isEdit) {
                            return (
                              <CTableRow key={idListCairan}>
                                <CTableHeaderCell>{idListCairan + 1}</CTableHeaderCell>
                                <CTableDataCell>
                                  <CFormSelect
                                    disabled={!isActive}
                                    name="tipeCairan"
                                    onChange={(e) => {
                                      handleEditDrainingFormEvaluation(
                                        dynamicElIdPosition,
                                        idField,
                                        idListCairan,
                                        e,
                                      )
                                    }}
                                    value={cairan.tipeCairan}
                                  >
                                    <option defaultValue="select" value="select">
                                      --- Pilih Tipe ---
                                    </option>
                                    {maintenanceData?.chemicals?.map((element, index) => (
                                      <option value={element.chemical_id} key={index}>
                                        {element.chemical_nm}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    disabled={!isActive}
                                    name="totalCairan"
                                    type="number"
                                    id="type"
                                    value={cairan.totalCairan}
                                    onChange={(e) =>
                                      handleEditDrainingFormEvaluation(
                                        dynamicElIdPosition,
                                        idField,
                                        idListCairan,
                                        e,
                                      )
                                    }
                                    min="0"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    disabled
                                    name="biaya"
                                    type="text"
                                    id="type"
                                    value={new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                    }).format(Number(cairan.biaya))}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    disabled={!isActive}
                                    color="success"
                                    onClick={() =>
                                      handleEditLiquidDoneFormEval(
                                        dynamicElIdPosition,
                                        idField,
                                        idListCairan,
                                      )
                                    }
                                  >
                                    <CIcon icon={cilCheckCircle} style={{ color: 'white' }} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            )
                          } else {
                            return (
                              <CTableRow key={idListCairan}>
                                <CTableHeaderCell>{idListCairan + 1}</CTableHeaderCell>
                                <CTableDataCell>
                                  {printTipeCairan(cairan.tipeCairan) || cairan.chemical_nm}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {cairan.totalCairan || cairan.vol_changes}
                                </CTableDataCell>
                                <CTableDataCell>
                                  {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                  }).format(Number(cairan.biaya || cairan.cost_chemical))}
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    disabled={!isActive}
                                    color="warning"
                                    onClick={() =>
                                      handleEditLiquidFormEval(
                                        dynamicElIdPosition,
                                        idField,
                                        idListCairan,
                                      )
                                    }
                                  >
                                    <CIcon icon={cilPen} style={{ color: 'white' }} />
                                  </CButton>
                                  <span style={{ marginRight: '3px' }} />
                                  <CButton
                                    disabled={!isActive}
                                    color="danger"
                                    onClick={() =>
                                      handleDeleteRowFormEval(
                                        dynamicElIdPosition,
                                        idField,
                                        cairan.id,
                                      )
                                    }
                                  >
                                    <CIcon icon={cilTrash} style={{ color: 'white' }} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            )
                          }
                        })}
                      </CTableBody>
                    </CTable>
                  </div>
                  {drainingField?.listCairan?.isError && (
                    <div className="error-form mb-4">{drainingField?.listCairan?.errorMessage}</div>
                  )}
                </CCardBody>
              </CCard>

              {/* drainingField.parameter.value, => kalo mau baseon pilih */}
              {drainingField.oosParam.length > 0 && (
                <CCard className="mb-4" color="white">
                  <CCardHeader>Recek Parameter</CCardHeader>
                  <CCardBody>
                    {filterParamRender(
                      paramRender?.[0]?.parameters,
                      // drainingField.parameter.value,
                      drainingField.oosParam,
                    ).map((param, id) => {
                      switch (param.param_nm) {
                        case 'Sludge':
                          return (
                            <div key={`${id}${param.param_nm}`}>
                              <div
                                style={{
                                  display: screenSize <= 768 ? 'block' : 'flex',
                                  marginTop: '30px',
                                }}
                              >
                                <CFormLabel className="col-sm-2 col-form-label">
                                  {param.param_nm}
                                </CFormLabel>
                                <div className="table-responsive">
                                  <CTable className="mx-auto w-auto">
                                    <CTableHead>
                                      <CTableRow>
                                        <CTableHeaderCell
                                          scope="col"
                                          className="align-midle text-center"
                                        >
                                          Acuan
                                        </CTableHeaderCell>

                                        <CTableHeaderCell className="align-midle">
                                          &nbsp;
                                        </CTableHeaderCell>
                                      </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                      <CTableRow>
                                        <CTableDataCell>
                                          <img
                                            src={imageDefault(
                                              param.param_nm,
                                              fields[0].Sludge.value,
                                            )}
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
                                              defaultChecked={
                                                dynamicEl.isFilled &&
                                                el.option_id === fields[0].Sludge.value
                                              }
                                              type="radio"
                                              value={el.option_id}
                                              name={param.param_nm}
                                              label={el.opt_nm}
                                              key={`${index}-${dynamicElIdPosition}evaluation`}
                                              id={`${index}-${dynamicElIdPosition}evaluation`}
                                              onChange={(e) =>
                                                handleChangeFormEvaluation(
                                                  dynamicElIdPosition,
                                                  idField,
                                                  e,
                                                  null,
                                                  {
                                                    ...el,
                                                    ...param,
                                                  },
                                                )
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
                                    <div className="error-form">
                                      {fields[0].Sludge.errorMessage}
                                    </div>
                                  </CCol>
                                ) : (
                                  formOptionsNote(param.options, fields[0].Sludge.value, 'Sludge')
                                )}
                              </CRow>
                            </div>
                          )
                        case 'Visual':
                          return (
                            <div key={`${id}${param.param_nm}`}>
                              <div
                                style={{
                                  display: screenSize <= 768 ? 'block' : 'flex',
                                  marginTop: '30px',
                                }}
                              >
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
                                            src={imageDefault(
                                              param.param_nm,
                                              fields[0].Visual.value,
                                            )}
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
                                              defaultChecked={
                                                dynamicEl.isFilled &&
                                                el.option_id === fields[0].Visual.value
                                              }
                                              type="radio"
                                              value={el.option_id}
                                              name={param.param_nm}
                                              label={el.opt_nm}
                                              key={`${index}-${dynamicElIdPosition}`}
                                              id={`${index}-${dynamicElIdPosition}`}
                                              onChange={(e) =>
                                                handleChangeFormEvaluation(
                                                  dynamicElIdPosition,
                                                  idField,
                                                  e,
                                                  null,
                                                  {
                                                    ...el,
                                                    ...param,
                                                  },
                                                )
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
                                    <div className="error-form">
                                      {fields[0].Visual.errorMessage}
                                    </div>
                                  </CCol>
                                ) : (
                                  formOptionsNote(param.options, fields[0].Visual.value, 'Visual')
                                )}
                              </CRow>
                            </div>
                          )
                        case 'Aroma':
                          return (
                            <CRow className="mb-3" key={`${id}${param.param_nm}`}>
                              <CFormLabel className="col-sm-2 col-form-label">
                                {param.param_nm}
                              </CFormLabel>
                              <CCol sm={5} style={{ paddingTop: '7px' }}>
                                <CFormSwitch
                                  disabled={!isActive}
                                  defaultChecked={fields[0].isStink.value}
                                  name="isStink"
                                  label={handleLabelAroma(fields[0].isStink.value, param.options)}
                                  id="formSwitchCheckChecked"
                                  value={fields[0].isStink.value}
                                  onChange={(e) =>
                                    handleChangeFormEvaluation(dynamicElIdPosition, e, {
                                      ...param,
                                      ...(fields[0].isStink.value
                                        ? param.options[0]
                                        : param.options[1]),
                                    })
                                  }
                                />
                              </CCol>
                            </CRow>
                          )
                        case 'PH':
                          return (
                            <CRow className="mb-3" key={`${id}${param.param_nm}`}>
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
                                    value={fields[0].PH.value}
                                    onChange={(e) => {
                                      handleChangeFormEvaluation(
                                        dynamicElIdPosition,
                                        idField,
                                        e,
                                        null,
                                        {
                                          ...param,
                                          ...param.options[0],
                                        },
                                      )
                                      handleOnFocusFormChecking(dynamicElIdPosition, 'PH')
                                    }}
                                  />
                                  <CInputGroupText id="basic-addon2">
                                    {param.options[0].units}
                                  </CInputGroupText>
                                  {fields[0].PH.isError ? (
                                    <div className="error-form">{fields[0].PH.errorMessage}</div>
                                  ) : handleInputValueStatus(
                                      param.options[0].min_value,
                                      param.options[0].max_value,
                                      fields[0].PH.value,
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
                            <CRow className="mb-3" key={`${id}${param.param_nm}`}>
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
                                    value={fields[0].Konsentrasi.value}
                                    onChange={(e) => {
                                      handleChangeFormEvaluation(
                                        dynamicElIdPosition,
                                        idField,
                                        e,
                                        null,
                                        {
                                          ...param,
                                          ...param.options[0],
                                        },
                                      )
                                      handleOnFocusFormChecking(dynamicElIdPosition, 'Konsentrasi')
                                    }}
                                  />
                                  <CInputGroupText id="basic-addon2">
                                    {param.options[0].units}
                                  </CInputGroupText>
                                  {fields[0].Konsentrasi.isError ? (
                                    <div className="error-form">
                                      {fields[0].Konsentrasi.errorMessage}
                                    </div>
                                  ) : handleInputValueStatus(
                                      param.options[0].min_value,
                                      param.options[0].max_value,
                                      fields[0].Konsentrasi.value,
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
                </CCard>
              )}

              {/* {idField === fields.length - 1 && (
                <CButton
                  disabled={!isActive}
                  color={'primary'}
                  onClick={() => addFormEvalField(dynamicElIdPosition)}
                >
                  Tambah Indikator
                </CButton>
              )} */}
            </CCardBody>
          </CCard>
        ))}
        {dynamicElIdPosition !== 0 && (
          <CCard color="white">
            <CCardBody>
              <CFormTextarea
                disabled={dynamicEl.isFilled}
                id="reason"
                label="Reason"
                name="reason"
                onChange={(e) => handleChangeFormEvaluation(dynamicElIdPosition, null, e)}
              ></CFormTextarea>
            </CCardBody>
          </CCard>
        )}

        <CCardFooter>
          <CRow className="mb-4">
            <CCol style={{ marginTop: '10px' }}>
              <CButton
                disabled={!isActive}
                color={'primary'}
                style={{ marginRight: '20px' }}
                onClick={() => handleSubmitFormEvaluation(dynamicElIdPosition)}
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
    </>
  )
}

EvaluationForm.propTypes = {
  dynamicElIdPosition: PropTypes.number,
  dynamicEl: PropTypes.object,
  maintenanceData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // drainingFields: PropTypes.array,
  parameters: PropTypes.array,
  handleDeleteRowFormEval: PropTypes.func,
  printTipeCairan: PropTypes.func,
  handleOnFocusFormChecking: PropTypes.func,
  handleAddingLiquidFormEvaluation: PropTypes.func,
  handleEditLiquidFormEval: PropTypes.func,
  handleEditLiquidDoneFormEval: PropTypes.func,
  handleChangeFormEvaluation: PropTypes.func,
  handleEditDrainingFormEvaluation: PropTypes.func,
  handleDeleteDrainingField: PropTypes.func,
  addFormEvalField: PropTypes.func,
  handleSubmitFormEvaluation: PropTypes.func,
}

export default EvaluationForm

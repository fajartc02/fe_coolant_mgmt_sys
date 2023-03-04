import React from 'react'
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
} from '@coreui/react'

import 'react-datepicker/dist/react-datepicker.css'

import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilPen, cilPlus, cilTrash } from '@coreui/icons'

const DrainingForm = ({
  handleDelete,
  handleAddingLiquid,
  handleEditLiquid,
  handleEditLiquidDone,
  handleEditFormDraining,
  maintenanceData,
  // drainingFields,
  dynamicElIdPosition,
  handleChangeFormDraining,
  printTipeCairan,
  parameters,
  handleDeleteDrainingField,
  addDrainingFields,
  handleSubmitDrainingForm,
  dynamicEl,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fields, isActive } = dynamicEl
  const isDrainingPage = location.pathname.indexOf('/draining/') !== -1

  return (
    <>
      <CCard color="white" className="mb-4">
        <CCardHeader>Draining Indikator</CCardHeader>
        {fields.map((drainingField, idField) => (
          <CCard color="white" key={idField}>
            <CCardBody>
              {isDrainingPage && dynamicElIdPosition !== 0 && (
                <CRow className="mb-3">
                  <CFormLabel htmlFor="pic" className="col-md-3 col-form-label">
                    Parameter yang akan diperbaiki
                  </CFormLabel>
                  <CCol md={5}>
                    <MultiSelect
                      disabled={!isActive}
                      value={drainingField.parameter}
                      onChange={(e) => {
                        handleChangeFormDraining(dynamicElIdPosition, idField, e, 'parameter')
                      }}
                      options={parameters}
                      optionLabel="name"
                      placeholder="Select Cities"
                      maxSelectedLabels={3}
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
              )}
              {!isDrainingPage && (
                <CRow className="mb-3">
                  <CFormLabel htmlFor="pic" className="col-md-3 col-form-label">
                    Parameter yang akan diperbaiki
                  </CFormLabel>
                  <CCol md={5}>
                    <MultiSelect
                      value={drainingField.parameter}
                      onChange={(e) => {
                        handleChangeFormDraining(dynamicElIdPosition, idField, e, 'parameter')
                      }}
                      options={parameters}
                      optionLabel="name"
                      placeholder="Select Cities"
                      maxSelectedLabels={3}
                    />
                    {drainingField?.isErrorParameter && (
                      <div className="error-form">{drainingField?.errorMessageParameter}</div>
                    )}
                  </CCol>
                  <CCol>
                    <div style={{ position: 'absolute', right: '19px', top: '5px' }}>
                      <CButton
                        size="sm"
                        disabled={!isActive}
                        onClick={() =>
                          handleDeleteDrainingField(dynamicElIdPosition, drainingField.id)
                        }
                        className="btn-close"
                      />
                    </div>
                  </CCol>
                </CRow>
              )}

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
                      {/* <CForm onSubmit={handleSubmit(onSubmit)}> */}
                      <CTableHeaderCell valign="middle">#</CTableHeaderCell>
                      <CTableDataCell>
                        <CFormSelect
                          disabled={!isActive}
                          name="tipeCairan"
                          onChange={(e) => {
                            handleChangeFormDraining(dynamicElIdPosition, idField, e)
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
                            handleChangeFormDraining(dynamicElIdPosition, idField, e)
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
                          onClick={() => handleAddingLiquid(dynamicElIdPosition, idField)}
                        >
                          <CIcon icon={cilPlus} style={{ color: 'white' }} />
                        </CButton>
                      </CTableDataCell>
                      {/* </CForm> */}
                    </CTableRow>
                    {drainingField.listCairan.map((cairan, idListCairan) => {
                      if (cairan.isEdit) {
                        return (
                          <CTableRow key={idListCairan}>
                            <CTableHeaderCell>{idListCairan + 1}</CTableHeaderCell>
                            <CTableDataCell>
                              <CFormSelect
                                disabled={!isActive}
                                name="tipeCairan"
                                onChange={(e) => {
                                  handleEditFormDraining(
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
                                  handleEditFormDraining(
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
                                  handleEditLiquidDone(dynamicElIdPosition, idField, idListCairan)
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
                            <CTableDataCell>{printTipeCairan(cairan.tipeCairan)}</CTableDataCell>
                            <CTableDataCell>{cairan.totalCairan}</CTableDataCell>
                            <CTableDataCell>
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                              }).format(Number(cairan.biaya))}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                disabled={!isActive}
                                color="warning"
                                onClick={() =>
                                  handleEditLiquid(dynamicElIdPosition, idField, idListCairan)
                                }
                              >
                                <CIcon icon={cilPen} style={{ color: 'white' }} />
                              </CButton>
                              <span style={{ marginRight: '3px' }} />
                              <CButton
                                disabled={!isActive}
                                color="danger"
                                onClick={() =>
                                  handleDelete(dynamicElIdPosition, idField, cairan.id)
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
              {drainingField.isError && (
                <div className="error-form mb-4">{drainingField?.errorMessage}</div>
              )}
              {isDrainingPage && dynamicElIdPosition !== 0 && idField === fields.length - 1 && (
                <CButton
                  disabled={!isActive}
                  color={'primary'}
                  onClick={() => addDrainingFields(dynamicElIdPosition)}
                >
                  Tambah Indikator
                </CButton>
              )}

              {!isDrainingPage && idField === fields.length - 1 && (
                <CButton
                  disabled={!isActive}
                  color={'primary'}
                  onClick={() => addDrainingFields(dynamicElIdPosition)}
                >
                  Tambah Indikator
                </CButton>
              )}
            </CCardBody>
          </CCard>
        ))}
        <CCard>
          <CCardBody>
            <CFormTextarea
              id="reason"
              label="Reason"
              name="reason"
              onChange={(e) => handleChangeFormDraining(dynamicElIdPosition, null, e)}
            ></CFormTextarea>
          </CCardBody>
        </CCard>
        <CCardFooter>
          <CRow className="mb-4">
            <CCol style={{ marginTop: '10px' }}>
              <CButton
                disabled={!isActive}
                color={'primary'}
                style={{ marginRight: '20px' }}
                onClick={() => handleSubmitDrainingForm(dynamicElIdPosition)}
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

DrainingForm.propTypes = {
  dynamicElIdPosition: PropTypes.number,
  dynamicEl: PropTypes.object,
  maintenanceData: PropTypes.object,
  // drainingFields: PropTypes.array,
  parameters: PropTypes.array,
  handleDelete: PropTypes.func,
  printTipeCairan: PropTypes.func,
  handleAddingLiquid: PropTypes.func,
  handleEditLiquid: PropTypes.func,
  handleEditLiquidDone: PropTypes.func,
  handleChangeFormDraining: PropTypes.func,
  handleEditFormDraining: PropTypes.func,
  handleDeleteDrainingField: PropTypes.func,
  addDrainingFields: PropTypes.func,
  handleSubmitDrainingForm: PropTypes.func,
}

export default DrainingForm

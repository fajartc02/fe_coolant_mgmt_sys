import React, { useState } from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormSelect,
} from '@coreui/react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
// import { CChartBar } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

const data = [
  {
    id: '1',
    name: 'mesin 1',
    line: 'Crank Shaft',
    pic: 'fajar',
    chemical: 12000,
    manHour: 12000,
  },
  {
    id: '2',
    name: 'mesin 2',
    line: 'Cylinder Head',
    pic: 'messi',
    chemical: 12000,
    manHour: 12000,
  },
  {
    id: '3',
    name: 'mesin 3',
    line: 'Cam Shaft',
    pic: 'cahyono',
    chemical: 12000,
    manHour: 12000,
  },
  {
    id: '4',
    name: 'mesin 4',
    line: 'Cylinder Block',
    pic: 'dulloh',
    chemical: 12000,
    manHour: 12000,
  },
  {
    id: '5',
    name: 'mesin 5',
    line: 'Cam Shaft',
    pic: 'rendri',
    chemical: 12000,
    manHour: 12000,
  },
]

const Schedule = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <CRow>
      <CCol xs={12}>
        <DocsCallout content="Tabel Informasi Jadwal Perbaikan Mesin" />
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="g-3">
              <CCol sm={7} />
              <CCol sm>
                {/* <CFormInput placeholder="State" aria-label="State" /> */}
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className={'form-control'}
                  placeholderText="start date"
                />
              </CCol>
              <CCol sm>
                {/* <CFormInput placeholder="Zip" aria-label="Zip" /> */}
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className={'form-control'}
                  placeholderText="end date"
                />
              </CCol>
              <CCol sm>
                <CFormSelect aria-label="Default select example">
                  <option>Line</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </CFormSelect>
              </CCol>
            </CRow>
            {/* <br />
            <strong>React Table</strong> <small>Striped rows</small> */}
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample href="components/table#striped-rows"> */}

            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mesin</CTableHeaderCell>
                  <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Chemical</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Man Hour</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((el, id) => (
                  <CTableRow key={id}>
                    <CTableHeaderCell scope="row">{el.id}</CTableHeaderCell>
                    <CTableDataCell>{el.name}</CTableDataCell>
                    <CTableDataCell>{el.pic}</CTableDataCell>
                    <CTableDataCell>{el.chemical}</CTableDataCell>
                    <CTableDataCell>{el.manHour}</CTableDataCell>
                    <CTableDataCell>{el.manHour + el.chemical}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Schedule

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
  CFormLabel,
  CFormInput,
  CFormFeedback,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { DocsCallout } from 'src/components'

import CalculationData from './cost-calculation.json'

const CostCalculation = () => {
  const [calData, setCalData] = useState(CalculationData)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const onHandleStartDate = (date) => {
    console.log(date)
    setStartDate(date)
  }

  const formatDataToArray = (data, name) => {
    let temp = []
    data.forEach((el) => {
      temp.push(name === 'machineName' ? el[name] : Number(el[name].replace(/[^0-9-]+/g, '')))
    })

    return temp
  }

  const newDate = new Date()
  const minDate = newDate.setDate(newDate.getDate() - 365)

  const formatDataSets = (data) => [
    {
      label: 'Chemical',
      backgroundColor: '#e55353',
      data: formatDataToArray(data, 'chemical'),
      stack: 0,
    },
    {
      label: 'Man Hour',
      backgroundColor: '#3399ff',
      data: formatDataToArray(data, 'manHour'),
      stack: 0,
    },
  ]

  // console.log(formatDataToArray(calData, 'chemical'))
  return (
    <CRow>
      <CCol xs={12}>
        <DocsCallout
          name="Chart"
          href="components/chart"
          content="React wrapper component for Chart.js 3.0, the most popular charting library."
        />
      </CCol>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            Bar Chart
            <CRow className="g-3">
              <CCol sm={7} />

              <CCol sm>
                <CFormLabel>Start Date</CFormLabel>
                <DatePicker
                  selected={startDate}
                  minDate={new Date(minDate)}
                  maxDate={new Date()}
                  onChange={(date) => onHandleStartDate(date)}
                  className={'form-control'}
                  placeholderText="start date"
                />
              </CCol>
              <CCol sm>
                <CFormLabel>End Date</CFormLabel>
                <DatePicker
                  selected={endDate}
                  maxDate={new Date()}
                  minDate={startDate}
                  onChange={(date) => setEndDate(date)}
                  className={'form-control'}
                  placeholderText="end date"
                />
              </CCol>
              <CCol sm>
                <CFormLabel>Line</CFormLabel>
                <CFormSelect aria-label="Default select example">
                  <option>Line</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: formatDataToArray(calData, 'machineName'),
                datasets: formatDataSets(calData),
                options: {},
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Table</strong> <small>Striped rows</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Use <code>striped</code> property to add zebra-striping to any table row within the{' '}
              <code>&lt;CTableBody&gt;</code>.
            </p>
            {/* <DocsExample href="components/table#striped-rows"> */}
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                  <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Chemical</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Man Hour</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {calData.map((element, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell>{element.id}</CTableHeaderCell>
                    <CTableDataCell>{element.machineName}</CTableDataCell>
                    <CTableDataCell>{element.line}</CTableDataCell>
                    <CTableDataCell>{element.pic}</CTableDataCell>
                    <CTableDataCell>
                      <p
                        style={{
                          color: element.chemical.indexOf('-') === -1 ? '#2eb85c' : '#e55353',
                        }}
                      >
                        {element.chemical}
                      </p>
                    </CTableDataCell>
                    <CTableDataCell>
                      <p
                        style={{
                          color: element.manHour.indexOf('-') === -1 ? '#2eb85c' : '#e55353',
                        }}
                      >
                        {element.manHour}
                      </p>
                    </CTableDataCell>
                    <CTableDataCell>
                      <p
                        style={{
                          color: element.total.indexOf('-') === -1 ? '#2eb85c' : '#e55353',
                        }}
                      >
                        {element.total}
                      </p>
                    </CTableDataCell>
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

export default CostCalculation

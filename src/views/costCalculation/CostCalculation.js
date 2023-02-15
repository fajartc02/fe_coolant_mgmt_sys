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
  CButton,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { DocsCallout } from 'src/components'

import CalculationData from '../../assets/json/cost-calculation.json'
import LineData from '../../assets/json/line.json'
import { Paragraph } from './StyledComponent'
moment.locale('id')

const CostCalculation = () => {
  const [calData, setCalData] = useState(CalculationData)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [line, setLine] = useState('')

  const handleApply = () => {
    var calDataWithDate = CalculationData.map((el) => {
      var dateString = el.date
      var dateParts = dateString.split('/')
      var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

      return {
        ...el,
        dateObject,
      }
    })
    var filterFunc = {
      moreThanStartDate: (item) => item.dateObject > startDate,
      lessThanEndDate: (item) => item.dateObject < endDate,
      equalToLine: (item) => item.line === line,
    }

    var selectedFunc = []
    if (startDate) {
      selectedFunc.push(filterFunc.moreThanStartDate)
    }

    if (endDate) {
      selectedFunc.push(filterFunc.lessThanEndDate)
    }

    if (line) {
      selectedFunc.push(filterFunc.equalToLine)
    }

    let result = calDataWithDate.filter((item) => selectedFunc.every((f) => f(item)))

    setCalData([...result])
  }

  const onHandleStartDate = (date) => {
    setStartDate(date)
  }

  const onHandleEndDate = (date) => {
    setEndDate(date)
  }

  const handleSelectLine = (e) => {
    // if (e.target.value === 'placeholder') return
    setLine(e.target.value)
  }

  const handleReset = () => {
    setCalData([...CalculationData])
    setStartDate('')
    setEndDate('')
    setLine('')
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
  // console.log(line, 'line')
  console.log(window.innerWidth, 'window.innerWidth---')
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
        <CCard className="mb-4" color="white">
          <CCardHeader>
            Bar Chart
            <CRow className="g-3">
              <CCol md={6} lg={6} sm={6} />

              <CCol className="ml-auto">
                <CFormLabel>Start Date</CFormLabel>
                <DatePicker
                  selected={startDate}
                  minDate={new Date(minDate)}
                  maxDate={new Date()}
                  onChange={(date) => onHandleStartDate(date)}
                  className={'form-control'}
                  placeholderText="start date"
                  dateFormat={'dd/MM/yyyy'}
                />
              </CCol>
              <CCol>
                <CFormLabel>End Date</CFormLabel>
                <DatePicker
                  selected={endDate}
                  maxDate={new Date()}
                  minDate={startDate}
                  onChange={(date) => onHandleEndDate(date)}
                  className={'form-control'}
                  placeholderText="end date"
                  dateFormat={'dd/MM/yyyy'}
                />
              </CCol>
              <CCol>
                <CFormLabel>Line</CFormLabel>
                <CFormSelect
                  aria-label="Default select example"
                  onChange={handleSelectLine}
                  value={line}
                >
                  <option selected value="placeholder">
                    select
                  </option>
                  {LineData.map((el) => (
                    <option key={el.id} value={el.name}>
                      {el.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol style={{ display: 'flex', flexGrow: 1, alignItems: 'flex-end' }}>
                <CButton
                  style={{ marginRight: '10px', display: 'inline-block' }}
                  color="primary"
                  onClick={handleApply}
                >
                  apply
                </CButton>

                <CButton
                  color="secondary"
                  onClick={handleReset}
                  style={{ marginRight: '10px', display: 'inline-block' }}
                >
                  reset
                </CButton>
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
        <CCard className="mb-4" color="white">
          <CCardHeader>
            <strong>React Table</strong> <small>Striped rows</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Use <code>striped</code> property to add zebra-striping to any table row within the{' '}
              <code>&lt;CTableBody&gt;</code>.
            </p>
            {/* <DocsExample href="components/table#striped-rows"> */}
            <div className="table-responsive">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
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
                      <CTableHeaderCell>{element.date}</CTableHeaderCell>
                      <CTableDataCell>{element.machineName}</CTableDataCell>
                      <CTableDataCell>{element.line}</CTableDataCell>
                      <CTableDataCell>{element.pic}</CTableDataCell>
                      <CTableDataCell>
                        <Paragraph
                          color={element.chemical.indexOf('-') === -1 ? `#2eb85c` : `#e55353`}
                          id="chemical"
                        >
                          {element.chemical}
                        </Paragraph>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Paragraph
                          color={element.manHour.indexOf('-') === -1 ? `#2eb85c` : `#e55353`}
                          id="chemical"
                        >
                          {element.manHour}
                        </Paragraph>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Paragraph
                          color={element.total.indexOf('-') === -1 ? `#2eb85c` : `#e55353`}
                          id="chemical"
                        >
                          {element.total}
                        </Paragraph>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CostCalculation

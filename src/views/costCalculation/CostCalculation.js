import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import { useQuery } from 'react-query'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { getLinesMaster, getCostGraph } from 'src/utils/api'
import { DocsCallout } from 'src/components'
import CalculationData from '../../assets/json/cost-calculation.json'
import { Paragraph } from './StyledComponent'
import moment from 'moment'

moment.locale('id')

const CostCalculation = () => {
  const [calData, setCalData] = useState(CalculationData)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [line, setLine] = useState('')

  const { data: lineMaster } = useQuery(['lines-master'], () => getLinesMaster(), {
    refetchOnWindowFocus: false,
    select: ({ data }) => {
      return data.data
    },
    onSuccess: (data) => {
      // setSelectedEmployee(data[0])
    },
  })

  useEffect(() => {
    // setStart(moment().format('YYYY-MM-DD'))
    // setEnd(moment().format('YYYY-MM-DD'))
  }, [])

  const { data: costGraph } = useQuery(
    ['cost-graph'],
    () => getCostGraph('2023-03-01', '2023-03-08'),
    {
      refetchOnWindowFocus: false,

      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        console.log(data, '===')

        // setSelectedEmployee(data[0])
      },
    },
  )

  console.log(costGraph, 'costGraph costGraph')

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
      equalToLine: (item) => item.line.toLowerCase() === line.toLocaleLowerCase(),
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
    alert(e.target.value)
  }

  const handleReset = () => {
    setCalData([...CalculationData])
    setStartDate('')
    setEndDate('')
    setLine('')
  }

  const formatDataToArray = (data, name) => {
    let temp = []
    console.log(data)
    data.forEach((el) => {
      temp.push(el[name])
    })

    return temp
  }

  const newDate = new Date()
  const minDate = newDate.setDate(newDate.getDate() - 365)

  const formatDataSets = (data) => [
    {
      label: 'Chemical',
      backgroundColor: '#e55353',
      data: formatDataToArray(data, 'cost_chemical'),
      stack: 0,
    },
    {
      label: 'Man Hour',
      backgroundColor: '#3399ff',
      data: formatDataToArray(data, 'cost_mh'),
      stack: 0,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <DocsCallout content="Cost Calculation adalah ..." />
      </CCol>
      <CCol>
        <CCard className="mb-4" color="white">
          <CCardHeader>
            <strong>Cost Calculation Chart</strong>
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
                  placeholderText="select date"
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
                  placeholderText="select date"
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
                  {lineMaster?.map((el) => (
                    <option key={el.line_id} value={el.line_id}>
                      {el.line_nm}
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
            {costGraph && (
              <CChartBar
                data={{
                  // labels: formatDataToArray(costGraph.graphData[0].machines, 'machine_nm'),
                  // datasets: formatDataSets(costGraph.graphData[0].machines),
                  options: {},
                }}
              />
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4" color="white">
          <CCardHeader className="py-3">
            <strong>Cost Calculation Detail</strong>
          </CCardHeader>
          <CCardBody className="p-0">
            {/* <DocsExample href="components/table#striped-rows"> */}
            <div className="table-responsive">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Start date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Finish date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Activity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost Chemical</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost Hour Chemical</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Detail</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {costGraph?.detailData?.map((element, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                      <CTableDataCell>
                        {moment(element.start_date).format('YYYY-MM-DD HH:mm:ss')}
                      </CTableDataCell>
                      <CTableDataCell>
                        {moment(element.finish_date).format('YYYY-MM-DD HH:mm:ss')}
                      </CTableDataCell>
                      <CTableDataCell>{element.line_nm}</CTableDataCell>
                      <CTableDataCell>{element.machine_nm}</CTableDataCell>
                      <CTableDataCell>{element.maintenance_nm}</CTableDataCell>
                      <CTableDataCell>
                        <Paragraph color={`#2eb85c`} id="chemical">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(Number(element.cost_chemical))}
                        </Paragraph>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Paragraph color={`#2eb85c`} id="chemical">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(Number(element.cost_mh))}
                        </Paragraph>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Paragraph color={`#2eb85c`} id="chemical">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(Number(element.cost_chemical + element.cost_mh))}
                        </Paragraph>
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link to={`/dashboard/report/machine_id/${element.periodic_check_id}`}>
                          <CButton color="secondary" size="sm">
                            Detail
                          </CButton>
                        </Link>
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

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

import Chart from 'react-apexcharts'

import moment from 'moment'
moment.locale('id')

const CostCalculation = () => {
  const [calData, setCalData] = useState(CalculationData)
  const [startFirstDate, setStartFirstDate] = useState('00/00/0000')
  const [startDate, setStartDate] = useState(new Date())
  const [todayDate, setTodayDate] = useState(new Date())
  const [lineName, setLineName] = useState(['Line name'])
  const [endDate, setEndDate] = useState('')
  const [selectedLine, setSelectedLine] = useState('')
  const [isLineSelected, setIsLineSelected] = useState(false)
  const [showMachineDetailChart, setShowMachineDetailChart] = useState(false)
  const [lineGraphData, setLineGraphData] = useState([
    {
      name: 'Chemical',
      data: [1],
    },
    {
      name: 'Man Hour',
      data: [1],
    },
  ])
  const [machineGraphData, setMachineGraphData] = useState([
    {
      name: 'Chemical',
      data: [1],
    },
    {
      name: 'Man Hour',
      data: [1],
    },
  ])

  // methods
  const { data: lineMaster } = useQuery(['lines-master'], () => getLinesMaster(), {
    refetchOnWindowFocus: false,
    select: ({ data }) => {
      return data.data
    },
    onSuccess: (data) => {},
  })
  const { data: costGraph } = useQuery(
    ['cost-graph'],
    () => getCostGraph(`${startFirstDate}`, `${endDate}`),
    {
      refetchOnWindowFocus: false,
      select: ({ data }) => {
        return data.data
      },
      onSuccess: (data) => {
        if (showMachineDetailChart) {
          mapMachinesDataToChart(data)
        } else {
          mapLinesDataToChart(data)
        }
      },
    },
  )
  const onTest = () => {
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
      equalToLine: (item) => item.selectedLine.toLowerCase() === selectedLine.toLocaleLowerCase(),
    }

    var selectedFunc = []
    if (startDate) {
      selectedFunc.push(filterFunc.moreThanStartDate)
    }

    if (endDate) {
      selectedFunc.push(filterFunc.lessThanEndDate)
    }

    if (selectedLine) {
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
  const handleSelectedLine = (e) => {
    setSelectedLine(e.target.value)
    changeLineLabel(e.target.value)
    setIsLineSelected(true)
  }
  const formatDataToArray = (data, name) => {
    let temp = []
    console.log(data)
    data.forEach((el) => {
      temp.push(el[name])
    })

    return temp
  }
  const mapLinesDataToChart = (data) => {
    const line = data.graphData[0]

    // set line name
    const temp = [`${line.line_nm}`]
    setLineName(temp)

    let graphLineDataToDisplay = [
      {
        name: 'Chemical',
        data: [line.sum_cost_chemical],
      },
      {
        name: 'Man Hour',
        data: [line.sum_cost_mh],
      },
    ]

    setLineGraphData(graphLineDataToDisplay)
  }
  const mapMachinesDataToChart = (data) => {
    const machines = data.graphData[0].machines

    // set line name on graph
    const temp = []
    const chemicalCostTemp = []
    const mhCostTemp = []
    machines.map((machine) => {
      temp.push(machine.machine_nm)

      chemicalCostTemp.push(machine.cost_chemical)
      mhCostTemp.push(machine.cost_mh)
    })

    let graphMachineDataToDisplay = [
      {
        name: 'Chemical',
        data: chemicalCostTemp,
      },
      {
        name: 'Man Hour',
        data: mhCostTemp,
      },
    ]
    setMachineGraphData(graphMachineDataToDisplay)
    setLineName(temp)
  }
  const handleApply = () => {
    setShowMachineDetailChart(true)
    mapMachinesDataToChart(costGraph)
  }
  const handleReset = () => {
    setShowMachineDetailChart(false)
    mapLinesDataToChart(costGraph)
    changeLineLabel(selectedLine)
  }
  const getFirstDateOfTheMonth = () => {
    const firstDay = `01/${moment().month() + 1}/${moment().year()}`
    setStartFirstDate(firstDay)
  }
  const changeLineLabel = (lineName) => {
    const temp = [`${lineName}`]
    setLineName(temp)
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

  // local variables
  var chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '100%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: lineName,
      title: {
        text: 'Nama mesin',
      },
    },
    yaxis: {
      title: {
        text: 'Dalam rupiah',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {},
    legend: {
      position: 'top',
      offsetY: 40,
    },
  }

  useEffect(() => {
    getFirstDateOfTheMonth()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <DocsCallout content="Cost Calculation adalah ..." />
      </CCol>
      <CCol>
        <CCard className="mb-4" color="white">
          <CCardHeader>
            <strong>Cost Calculation Chart</strong>
            <CRow>
              <CCol md={6} lg={6} sm={6} />

              <CCol className="ml-auto">
                <CFormLabel>Start Date</CFormLabel>
                <DatePicker
                  minDate={new Date(minDate)}
                  maxDate={new Date()}
                  onChange={(date) => onHandleStartDate(date)}
                  className={'form-control'}
                  placeholderText="select date"
                  dateFormat={'dd/MM/yyyy'}
                  value={startFirstDate}
                />
              </CCol>
              <CCol>
                <CFormLabel>End Date</CFormLabel>
                <DatePicker
                  selected={todayDate}
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
                  onChange={handleSelectedLine}
                  value={selectedLine}
                >
                  <option selected value="placeholder">
                    select
                  </option>
                  {lineMaster?.map((el) => (
                    <option key={el.line_id} value={el.line_nm}>
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
                  disabled={!isLineSelected}
                >
                  apply
                </CButton>

                <CButton
                  color="secondary"
                  onClick={handleReset}
                  style={{ display: 'inline-block' }}
                >
                  reset
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {/* {costGraph && (
              <CChartBar
                data={{
                  labels: formatDataToArray(costGraph.graphData[0].machines, 'machine_nm'),
                  datasets: formatDataSets(costGraph.graphData[0].machines),
                  options: {},
                }}
              />
            )} */}

            {showMachineDetailChart ? (
              <Chart options={chartOptions} series={machineGraphData} type="bar" height={400} />
            ) : (
              <Chart options={chartOptions} series={lineGraphData} type="bar" height={400} />
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
                        <Link
                          to={`/dashboard/report/${element.machine_id}/${element.periodic_check_id}`}
                        >
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

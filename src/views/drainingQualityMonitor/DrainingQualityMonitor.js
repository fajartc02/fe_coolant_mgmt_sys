import React, { useState } from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
} from '@coreui/react'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import { Chart, registerables } from 'chart.js'

import { Line } from 'react-chartjs-2'

import { DocsCallout } from 'src/components'

import CalculationData from '../../assets/json/cost-calculation.json'

import annotationPlugin from 'chartjs-plugin-annotation'
Chart.register(...registerables, annotationPlugin)
moment.locale('id')

const chartData = {
  labels: [
    '',
    'ok;1;23-10-2022',
    'ok;2;12-11-2022',
    'ok;3;22-12-2022',
    'ok;4;23-01-2023',
    'ok;5;23-01-2023',
    'ok;6;23-01-2023',
    '',
  ],
  datasets: [
    {
      display: false,
      data: [null, 5, 2.9, 4, 4.8, 2.8, 3.9, null],
      borderColor: 'black',
    },
  ],
}

const DrainingQualityMonitor = () => {
  const [calData, setCalData] = useState(CalculationData)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [line, setLine] = useState('')

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
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CTable striped bordered style={{ textAlign: 'center' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Mesin</CTableHeaderCell>
                  <CTableHeaderCell>FollowUp concentration</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell align="middle">1</CTableDataCell>
                  <CTableDataCell align="middle">HSHS</CTableDataCell>
                  <CTableDataCell>
                    <div style={{ width: '100%', minHeight: '500px' }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            annotation: {
                              annotations: {
                                line1: {
                                  type: 'line',
                                  yMin: 6,
                                  yMax: 6,
                                  borderColor: 'rgb(255, 99, 132)',
                                  borderWidth: 2,
                                  borderDash: [10],
                                  borderDashOffset: 10,
                                },
                                line2: {
                                  type: 'line',
                                  yMin: 3,
                                  yMax: 3,
                                  borderColor: 'rgb(255, 99, 132)',
                                  borderWidth: 2,
                                  borderDash: [10],
                                  borderDashOffset: 10,
                                },
                              },
                            },
                            legend: {
                              display: false,
                            },
                            title: {
                              display: false,
                              text: 'Chart.js Line Chart ss',
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                display: true,
                                // tickLength: 20,
                              },
                              beginAtZero: false,
                              maintainAspectRatio: false,
                              autoSkip: false,
                              display: true,
                              ticks: {
                                callback: function (label) {
                                  const labelValue = this.getLabelForValue(label)
                                  var month = labelValue.split(';')[0]
                                  return month
                                },
                                crossAlign: 'top',
                              },

                              title: {
                                display: true,
                                text: 'Judge',
                                align: 'start',
                                padding: {
                                  top: -10,
                                  bottom: 10,
                                },
                              },
                            },

                            secondXAxis: {
                              axis: 'x',
                              ticks: {
                                callback: function (label) {
                                  const labelValue = this.getLabelForValue(label)
                                  var month = labelValue.split(';')[0]
                                  var year = labelValue.split(';')[1]
                                  return year
                                },
                                crossAlign: 'center',
                              },
                              grid: {
                                drawOnChartArea: false,
                              },
                              title: {
                                display: true,
                                text: 'Bulan',
                                align: 'start',
                              },
                            },
                            thirdXAxis: {
                              axis: 'x',
                              ticks: {
                                callback: function (label) {
                                  const labelValue = this.getLabelForValue(label)
                                  var month = labelValue.split(';')[0]
                                  var year = labelValue.split(';')[2]

                                  return year
                                },
                              },
                              grid: {
                                drawOnChartArea: false,
                              },
                              title: {
                                display: true,
                                text: 'TGL CHECK',
                                align: 'start',
                              },
                            },
                            y: {
                              maintainAspectRatio: false,
                              beginAtZero: false,
                              max: 8,
                              min: 2,
                              ticks: {
                                stepSize: 0.5,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DrainingQualityMonitor

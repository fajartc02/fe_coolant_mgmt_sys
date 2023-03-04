/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useQuery } from 'react-query'
import { Chart, ArcElement } from 'chart.js'
import { CChartPie } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import moment from 'moment'

import { cilCheckCircle, cilXCircle } from '@coreui/icons'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { CardCube } from 'src/components'

// post repair pengecekan untuk penambahan chemical=> chemical_id, vol_changes, periodic_check_id, cost_chemical, task_id
// post repair pengecekan untuk pengecekan evaluasi=>
// => option [{periodic_check_id, param_id, option_id, rule_id, notes}]
// => range [{ task_value: inputan user, task_status: ok/ng, periodic_check_id, param_id, option_id, rule_id, notes }]

// STYLING
import { MachineLine, MachineBlock } from './StyledComponent'

// API
import {
  getLinesMap,
  getMachineStatusMap,
  getLinesSummaries,
  getMaintenanceMachineCheck,
} from 'src/utils/api'
moment.locale('id')

Chart.register(ArcElement)

const Dashboard = () => {
  const navigate = useNavigate()
  const [queryLinesMapId, setQueryLinesMapId] = useState(1)
  const [selectedMachine, setSelectedMachine] = useState({})
  const [endMaintenanceDate, setEndMaintenanceDate] = useState('')
  const [startMaintenanceDate, setStartMaintenanceDate] = useState('')
  const [lineSummary, setLineSummary] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const { data: summaryResult } = useQuery(['lines-summary'], () => getLinesSummaries(), {
    refetchOnWindowFocus: false,
    select: ({ data }) => {
      const newData = data.data.map((el, idx) => ({
        ...el,
        isSelected: idx === 0,
      }))
      return newData
    },
    onSuccess: (data) => {
      setLineSummary(data)
    },
  })

  const { data: recursiveResult, refetch: refetchLineMap } = useQuery(
    ['lines-map', queryLinesMapId],
    () => getLinesMap(queryLinesMapId),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!summaryResult,
    },
  )

  // start_date=2023-02-28 07:00:00&end_date=2023-03-01 06:00:00

  const { data: maintenanceCheckResult, refetch: refetchMaitenanceCheck } = useQuery(
    ['maintenance-check', selectedMachine.machine_id],
    () =>
      getMaintenanceMachineCheck(
        selectedMachine.machine_id,
        startMaintenanceDate,
        endMaintenanceDate,
      ),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: false,
      select: ({ data }) => {
        return data
      },
      onSuccess: ({ data }) => {
        setOpenModal(true)
      },
    },
  )

  useEffect(() => {
    if (selectedMachine.machine_id) {
      refetchMaitenanceCheck()
    }
  }, [selectedMachine, refetchMaitenanceCheck])

  const handleClickSummaryCard = (item) => {
    const newData = [...lineSummary]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.line_id === el.line_id,
    }))

    setQueryLinesMapId(item.line_id)
    refetchLineMap()
    setLineSummary(updateData)
  }

  const handleClickMachine = (machine) => {
    var format = 'HH:mm:ss'
    let startLimitTime = moment('00:00:01', format)
    let endLimitTime = moment('06:59:59', format)

    if (moment().isBetween(startLimitTime, endLimitTime, undefined, '[]')) {
      setStartMaintenanceDate(`${moment().add(-1, 'days').format('YYYY-MM-DD')} 07:00:00`)
      setEndMaintenanceDate(`${moment().format('YYYY-MM-DD')} 06:59:59`)
    } else {
      setStartMaintenanceDate(`${moment().format('YYYY-MM-DD')} 07:00:00`)
      setEndMaintenanceDate(`${moment().add(1, 'days').format('YYYY-MM-DD')} 06:59:59`)
    }

    setSelectedMachine(machine)
    if (machine.machine_id === selectedMachine.machine_id) {
      refetchMaitenanceCheck()
    }
  }

  const modalDescriptionFormater = () => {
    if (maintenanceCheckResult?.data?.length === 0) {
      return (
        <p>
          Mesin <strong>{selectedMachine.machine_nm}</strong> belum memiliki jadwal maintenance
        </p>
      )
    } else {
      return (
        <>
          <p>
            Mesin <strong>{selectedMachine.machine_nm}</strong> memiliki jadwal maintenance sebagai
            berikut:
          </p>
          <div className="table-responsive">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nama Mesin</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {maintenanceCheckResult?.data.map((maintenance, idListCairan) => (
                  <CTableRow key={idListCairan}>
                    <CTableHeaderCell className="text-center">{idListCairan + 1}</CTableHeaderCell>
                    <CTableDataCell>{maintenance.maintenance_nm}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {maintenance.start_date ? (
                        <CIcon icon={cilCheckCircle} style={{ color: '#47f213' }} size="xl" />
                      ) : (
                        <CIcon icon={cilXCircle} style={{ color: '#e55353' }} size={'xl'} />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="primary"
                        onClick={() => {
                          setOpenModal(false)
                          if (maintenance.maintenance_id === 1) {
                            navigate(
                              `/dashboard/report/${selectedMachine.machine_id}/${maintenance.periodic_check_id}`,
                            )
                          } else {
                            navigate(
                              `/dashboard/draining/${selectedMachine.machine_id}/${maintenance.periodic_check_id}`,
                            )
                          }
                        }}
                      >
                        Mulai Sekarang
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        </>
      )
    }
  }

  const Machine = ({ data }) => {
    const { data: machines } = useQuery(
      ['machine-status', data.line_id],
      () => getMachineStatusMap(data.line_id),
      {
        select: ({ data }) => {
          return data.data
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
      },
    )

    return (
      <>
        {machines &&
          machines.length > 0 &&
          machines?.map((machine, id) => (
            <React.Fragment key={id}>
              <CardCube key={id} value={machine} index={id} onClick={handleClickMachine} />
            </React.Fragment>
          ))}
      </>
    )
  }

  const ReComp = ({ data }) => {
    return (
      <React.Fragment>
        {data[0].loop_by === 'COL' && (
          <CRow>
            {data.map((parent, idx) => (
              <CCol key={idx}>
                <CCard color="white">
                  <CCardHeader>{parent.line_nm}</CCardHeader>
                  <CCardBody>
                    {parent.children.length > 0 ? (
                      <ReComp data={parent.children} />
                    ) : (
                      <MachineLine>
                        <Machine data={parent} />
                      </MachineLine>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
        {data[0].loop_by === 'ROW' && (
          <React.Fragment>
            {data.map((parent, idx) => (
              <CCard key={idx} color="white">
                <CCardHeader key={idx}>{parent.line_nm}</CCardHeader>
                <CCardBody>
                  {parent.children.length > 0 ? (
                    <ReComp data={parent.children} />
                  ) : (
                    <MachineLine>
                      <Machine data={parent} />
                    </MachineLine>
                  )}
                </CCardBody>
              </CCard>
            ))}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  const pieDatasetsFormater = (item) => {
    return [
      {
        label: 'Line Machine Summary',
        data: [item.Danger, item.Normal, item.Warning],
        backgroundColor: ['#ff3f00', '#00ff90', '#ffbb00'],
      },
    ]
  }

  return (
    <>
      <CRow>
        {lineSummary &&
          lineSummary.map((item, index) => (
            <CCol lg={3} md={3} sm={3} key={index}>
              <CCard
                color={item.isSelected ? 'info' : 'white'}
                textColor={item.textColor}
                className="text-center"
                onClick={() => handleClickSummaryCard(item)}
              >
                <CCardHeader>{item.line_nm}</CCardHeader>
                <CCardBody>
                  <CChartPie
                    data={{
                      labels: ['Danger', 'Normal', 'Warning'],
                      datasets: pieDatasetsFormater(item),
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>

      <MachineBlock>
        {recursiveResult?.data?.data && (
          <CCard color="white">
            <CCardHeader>{recursiveResult?.data?.data?.line_nm}</CCardHeader>
            <CCardBody>{<ReComp data={recursiveResult?.data?.data?.children} />}</CCardBody>
          </CCard>
        )}
      </MachineBlock>

      <CModal visible={openModal} onClose={() => setOpenModal(false)}>
        <CModalHeader>
          <CModalTitle>Informasi</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalDescriptionFormater()}</CModalBody>

        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              setOpenModal(false)
            }}
          >
            Oke
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Dashboard

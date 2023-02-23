/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
import { useQuery } from 'react-query'
import { Chart, ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { CChartPie } from '@coreui/react-chartjs'

import { CardCube } from '../../components'

// REDUX
import { setSelectedMachine } from '../../stores/actions'

// STYLING
import { MachineLine, MachineBlock } from './StyledComponent'

// ASSETS / JSON
import MachineSummary from '../../assets/json/machine-block-summary.json'
import MachineStatusCam from '../../assets/json/machine-status-cam.json'
import MachineStatusCylinder from '../../assets/json/machine-status-cylinder.json'
import LineCam from '../../assets/json/line-cam.json'
import LineCylinder from '../../assets/json/line-cylinder.json'
// API
import { getLinesMap, getMachineStatusMap, getLinesSummaries } from 'src/utils/api'

Chart.register(ArcElement)

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [queryLinesMapId, setQueryLinesMapId] = useState(1)
  const [machineStatusUsed, setMachineStatusUsed] = useState(MachineStatusCylinder)
  const [dataLineUsed, setDataLineUsed] = useState(LineCylinder)
  const [lineSummary, setLineSummary] = useState([])

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
    if (machine.is_changes_checmical_status) {
      navigate(`/dashboard/draining/${machine.machine_id}/${machine.machine_nm}`)
      dispatch(setSelectedMachine(machine))
    } else {
      navigate(`/dashboard/report/${machine.machine_id}/${machine.machine_nm}`)
      dispatch(setSelectedMachine(machine))
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
        backgroundColor: ['rgb(255, 99, 132)', '#00ff90', 'rgb(255, 205, 86)'],
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
                  {/* <Pie
                    data={{
                      labels: ['Danger', 'Normal', 'Warning'],
                      datasets: pieDatasetsFormater(item),
                    }}
                  /> */}
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
    </>
  )
}

export default Dashboard

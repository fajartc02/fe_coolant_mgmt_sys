/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
import { useQuery } from 'react-query'
import { Chart, ArcElement } from 'chart.js'
import { Pie } from 'react-chartjs-2'

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
import { getLinesMap, getMachineStatusMap } from 'src/utils/api'

Chart.register(ArcElement)

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [machineStatusUsed, setMachineStatusUsed] = useState(MachineStatusCylinder)
  const [dataLineUsed, setDataLineUsed] = useState(LineCylinder)

  const { data: recursiveResult } = useQuery(['lines-map', 1], () => getLinesMap(1), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const [machineDataPreview, setMachineDataPreview] = useState(MachineSummary)

  const handleClickSummaryCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))

    var index = machineDataPreview.findIndex((obj) => obj.line_nm === item.line_nm)
    setDataLineUsed(index < 2 ? LineCylinder : LineCam)
    setMachineStatusUsed(index < 2 ? MachineStatusCylinder : MachineStatusCam)
    setMachineDataPreview(updateData)
  }

  const handleClickMachine = (machine) => {
    console.log(machine, '  machine')
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
        {machineStatusUsed.data &&
          machineStatusUsed.data.length > 0 &&
          machineStatusUsed.data?.map((machine, id) => (
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

  const pieDataFormater = (item) => {
    console.log(item, '===')
    return {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [300, 50, 100],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
        },
      ],
    }
  }

  return (
    <>
      <CRow>
        {machineDataPreview.map((item, index) => (
          <CCol lg={3} md={3} sm={3} key={index}>
            <CCard
              color={item.isSelected ? 'info' : 'white'}
              textColor={item.textColor}
              className="text-center"
              onClick={() => handleClickSummaryCard(item)}
            >
              <CCardHeader>{item.line_nm}</CCardHeader>
              <CCardBody>
                <Pie data={pieDataFormater(item)} />
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
      <MachineBlock>
        {dataLineUsed?.data && (
          <CCard color="white">
            <CCardHeader>{dataLineUsed?.data?.line_nm}</CCardHeader>
            <CCardBody>{<ReComp data={dataLineUsed?.data?.children} />}</CCardBody>
          </CCard>
        )}
      </MachineBlock>
    </>
  )
}

export default Dashboard

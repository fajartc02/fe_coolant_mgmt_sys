/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
import { useQuery } from 'react-query'

import { CardCube } from '../../components'

// REDUX
import { setSelectedMachine } from '../../stores/actions'

// STYLING
import { MachineLine, MachineBlock } from './StyledComponent'

// ASSETS / JSON
import MachineSummary from '../../assets/json/machine-block-summary.json'
// API
import { getLinesMap, getMachineStatusMap } from 'src/utils/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    setMachineDataPreview(updateData)
  }

  const handleClickMachine = (machine) => {
    navigate(`/dashboard/report/${machine.machine_id}/${machine.machine_nm}`)
    dispatch(setSelectedMachine(machine))
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

  // console.log(recursiveResult?.data?.data)

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
                <CRow className="align-items-start">
                  {item.summary.map((el, index) => (
                    <CCol lg={4} md={4} key={index}>
                      <CCard className="text-center" textColor="white" color="white">
                        <CCardBody>
                          <CCardText className="text-center">
                            <CBadge className="text-center" color={el.color} shape="rounded-circle">
                              {el.total}
                            </CBadge>
                          </CCardText>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
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

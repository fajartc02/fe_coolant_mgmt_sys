import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'

import MachineSummary from './machine-block-summary.json'
import MachineData from './machine-data.json'

const Dashboard = () => {
  const navigate = useNavigate()

  const [machineDataPreview, setMachineDataPreview] = useState(MachineSummary)
  const [machineDataBlock, setMachineDataBlock] = useState(MachineData)
  const [selectedMachineBlock, setSelectedMachineBlock] = useState(machineDataBlock[0])

  const handleClickCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))

    const filteredData = machineDataBlock.filter(
      (machineBlock) => machineBlock.idCategory === item.id,
    )[0]

    setSelectedMachineBlock(filteredData)

    setMachineDataPreview(updateData)
  }

  const handleClickMachine = () => {
    navigate(`/dashboard/report`)
  }

  return (
    <>
      <CRow>
        {machineDataPreview.map((item, index) => (
          <CCol lg={3} md={3} key={index}>
            <CCard
              color={item.isSelected ? 'info' : 'white'}
              textColor={item.textColor}
              className="text-center"
              onClick={() => handleClickCard(item)}
            >
              <CCardHeader>{item.title}</CCardHeader>
              <CCardBody>
                <CRow className="align-items-start">
                  {item.content.map((el, index) => (
                    <CCol lg={4} md={4} key={index}>
                      {/* <CBadge color={el.color} shape="rounded-circle">
                        {el.total}
                      </CBadge> */}
                      {/* <CCard color={el.color} className="text-center" textColor="white">
                        <CCardBody>
                          <CCardText>{el.total}</CCardText>
                        </CCardBody>
                      </CCard> */}
                      <CCard className="text-center" textColor="white">
                        <CCardBody>
                          <CCardText>
                            <CBadge color={el.color} shape="rounded-circle">
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
      <div style={styles.machineContainer}>
        {selectedMachineBlock.listMachine.map((line, indexLine) => (
          <React.Fragment key={indexLine}>
            <div style={{ marginTop: '20px' }}>
              <p style={{ textAlign: 'center' }}>LINE {line.lineName}</p>
            </div>
            <div style={styles.machineLine}>
              {line.lineMachine.map((machine, indexMachine) => (
                <div
                  style={{ ...styles.machineCard, ...styles[machine.status] }}
                  key={indexMachine}
                  onClick={() => handleClickMachine(machine)}
                >
                  <p style={{ textAlign: 'center', marginBottom: '0px' }}>{machine.machineName}</p>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default Dashboard

const styles = {
  machineContainer: {
    marginTop: '20px',
    width: '100%',
    backgroundColor: 'white',
    borderWidth: '1px',
    borderColor: '#c4c9d0',
    borderStyle: 'solid',
    padding: '20px',
    borderRadius: '10px',
  },
  machineLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineCard: {
    width: '50px',
    height: '100px',
    borderWidth: '1px',
    borderColor: '#c4c9d0',
    borderStyle: 'solid',
    margin: '10px',
    padding: '30px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  danger: {
    backgroundColor: 'red',
  },
  warning: {
    backgroundColor: 'orange',
  },
  safe: {
    backgroundColor: 'green',
  },
}

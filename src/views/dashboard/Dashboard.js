import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
import { setSelectedMachine } from '../../stores/actions'

import MachineSummary from '../../assets/json/machine-block-summary.json'
import MachineData from '../../assets/json/machine-data.json'
import CamShaft from '../../assets/images/cam-shaft.jpeg'
import CrankShaft from '../../assets/images/crank-shaft.jpeg'
import CylinderHead from '../../assets/images/cylinder-head.jpg'
import CylinderBlock from '../../assets/images/cylinder-block.jpeg'

const imageSelection = (name) => {
  switch (true) {
    case name.indexOf('Cylinder Head') !== -1:
      return CylinderHead
    case name.indexOf('Cylinder Block') !== -1:
      return CylinderBlock
    case name.indexOf('Cam Shaft') !== -1:
      return CamShaft
    case name.indexOf('Crank Shaft') !== -1:
      return CrankShaft

    default:
      return CylinderHead
  }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [machineDataPreview, setMachineDataPreview] = useState(MachineSummary)
  const [machineDataBlock, setMachineDataBlock] = useState(MachineData)
  const [selectedMachineBlock, setSelectedMachineBlock] = useState()

  useEffect(() => {
    let result = []

    MachineData[0]?.line_area?.forEach((el) => {
      el.machines.forEach((e) => {
        result.push(e)
      })
    })

    setSelectedMachineBlock(result)
  }, [])

  const handleClickCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))

    const filteredData = machineDataBlock.filter(
      (machineBlock) => machineBlock.line_id === item.id,
    )[0]

    let result = []

    filteredData?.line_area?.forEach((el) => {
      el.machines.forEach((e) => {
        result.push(e)
      })
    })

    setSelectedMachineBlock(result)

    setMachineDataPreview(updateData)
  }

  const handleClickMachine = (machine) => {
    navigate(`/dashboard/report`)
    dispatch(setSelectedMachine(machine))
  }

  console.log(selectedMachineBlock)

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
              <CCardHeader>{item.line_nm}</CCardHeader>
              <CCardBody>
                <CRow className="align-items-start">
                  {item.summary.map((el, index) => (
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
      <div style={styles.machineContainer}>
        <React.Fragment>
          <div style={{ marginTop: '20px' }}>
            <p style={{ textAlign: 'center' }}>LINE </p>
          </div>
          <div style={styles.machineLine}>
            {selectedMachineBlock?.map((machine, indexMachine) => (
              <div
                style={{ ...styles.machineCard }}
                // style={{ ...styles.machineCard, ...styles[machine.status] }}
                key={indexMachine}
                onClick={() => handleClickMachine(machine)}
              >
                <div>
                  <img
                    src={imageSelection(machine.machine_nm)}
                    alt="uploadedImage"
                    id="uploadedImage"
                    style={{
                      height: '80px',
                      width: '80px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  style={{
                    borderWidth: `5px`,
                    borderStyle: 'solid',
                    ...styles[machine.status],
                  }}
                />
                <div>
                  <p style={{ textAlign: 'center', marginBottom: '0px', fontSize: '12px' }}>
                    {machine.machine_nm}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
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

    flexWrap: 'wrap',
  },
  machineCard: {
    // width: '80px',
    borderWidth: '1px',
    borderColor: '#c4c9d0',
    borderStyle: 'solid',
    padding: '10px',
    borderRadius: '20px',
    cursor: 'pointer',
    margin: '10px',
  },
  danger: {
    borderColor: 'red',
  },
  warning: {
    borderColor: 'orange',
  },
  safe: {
    borderColor: 'green',
  },
}

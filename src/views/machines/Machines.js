import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

import { CardCube } from '../../components'

// REDUX
import { setSelectedMachine } from '../../stores/actions'

// STYLING
import './styles.scss'

// ASSETS / JSON
import MachineSummary from '../../assets/json/machine-block-summary.json'
import MachineData from '../../assets/json/machine-data.json'

const Machines = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [machineDataPreview, setMachineDataPreview] = useState(MachineSummary)
  const [machineDataBlock, setMachineDataBlock] = useState(MachineData)
  const [selectedMachineBlock, setSelectedMachineBlock] = useState()

  useEffect(() => {
    setSelectedMachineBlock(machineDataBlock[0])
  }, [])

  const handleClickSummaryCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))
    setMachineDataPreview(updateData)

    const filteredData = machineDataBlock.filter(
      (machineBlock) => machineBlock.line_id === item.id,
    )[0]

    setSelectedMachineBlock(filteredData)
  }

  const handleClickMachine = (machine) => {
    navigate(`/dashboard/report`)
    dispatch(setSelectedMachine(machine))
  }

  const SortableItem = SortableElement(({ value, index }) => (
    <CardCube value={value} index={index} onClick={handleClickMachine} />
  ))

  const SortableList = SortableContainer(({ items }) => (
    <div className="machineContainer">
      {items?.line_area?.map((element, index) => (
        <div key={index}>
          <div style={{ marginTop: '20px' }}>
            <p style={{ textAlign: 'center' }}>{`${element.area_sub}`} </p>
          </div>
          <div className="machineLine">
            {element.machines.map((machine, idx) => (
              <SortableItem
                value={machine}
                index={idx}
                key={machine.index_machine}
                collection={index}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ))

  const onSortEnd = ({ oldIndex, newIndex, collection }) => {
    let arr = arrayMove(selectedMachineBlock.line_area[collection].machines, oldIndex, newIndex)
    // update index position
    for (let i = 0; i < arr.length; i++) {
      arr[i].index_pos = i
    }

    // update array
    const temp = selectedMachineBlock.line_area.map((element, index) => {
      if (index === collection) {
        return {
          ...element,
          machines: arr,
        }
      }
      return element
    })

    // update object selectedMachineBlock
    const updateData = {
      ...selectedMachineBlock,
      line_area: temp,
    }

    setSelectedMachineBlock(updateData)
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
              onClick={() => handleClickSummaryCard(item)}
            >
              <CCardHeader>{item.line_nm}</CCardHeader>
              <CCardBody>
                <CRow className="align-items-start">
                  {item.summary.map((el, index) => (
                    <CCol lg={4} md={4} key={index}>
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

      <SortableList items={selectedMachineBlock} axis="xy" onSortEnd={onSortEnd} distance={1} />
    </>
  )
}

export default Machines

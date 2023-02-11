/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'
// import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

import { CardCube } from '../../components'

// REDUX
import { setSelectedMachine } from '../../stores/actions'

// STYLING
import './styles.scss'

// ASSETS / JSON
import MachineSummary from '../../assets/json/machine-block-summary.json'
import MachineData from '../../assets/json/machine-data.json'

const dummy1 = {
  line_nm: 'Cylinder Head',
  line_desc: '',
  line_lvl: 'LINE',
  idx_pos: 0,
  childs: [
    {
      line_nm: 'Area Rough',
      line_desc: '',
      line_lvl: 'AREA',
      idx_pos: 1,
      childs: [
        {
          line_nm: 'Cell Rough A',
          line_desc: '',
          line_lvl: 'CELL',
          idx_pos: 1,
          machines: [
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
          ],
        },
        {
          line_nm: 'Cell Rough B',
          line_desc: '',
          line_lvl: 'CELL',
          idx_pos: 2,
          machines: [
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
          ],
        },
      ],
    },
    {
      line_nm: 'Area Finish',
      line_desc: '',
      line_lvl: 'AREA',
      idx_pos: 2,
      childs: [
        {
          line_nm: 'Cell Finish A',
          line_desc: '',
          line_lvl: 'CELL',
          idx_pos: 1,
          machines: [
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#fff600 ',
              status_check: 'Normal',
            },
          ],
        },
        {
          line_nm: 'Cell Finish B',
          line_desc: '',
          line_lvl: 'CELL',
          idx_pos: 2,
          machines: [
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#fff600',
              status_check: 'Normal',
            },
            {
              machine_id: 0,
              machine_nm: 'IMSP-0001',
              idx_pos: 1,
              status_color: '#00ff94',
              status_check: 'Normal',
            },
          ],
        },
      ],
    },
  ],
}

const dummy2 = {
  line_nm: 'test line',
  line_desc: '',
  line_lvl: 'LINE',
  idx_pos: 0,
  childs: [
    {
      line_nm: 'test cell',
      line_desc: '',
      line_lvl: 'CELL',
      idx_pos: 0,
      machines: [
        {
          machine_id: 0,
          machine_nm: 'IMSP-0001',
          idx_pos: 1,
          status_color: '#fff600',
          status_check: 'Normal',
        },
        {
          machine_id: 1,
          machine_nm: 'IMSP-0001',
          idx_pos: 2,
          status_color: '#00ff94',
          status_check: 'Normal',
        },
      ],
    },
    {
      line_nm: 'test cell 2',
      line_desc: '',
      line_lvl: 'CELL',
      idx_pos: 1,
      machines: [
        {
          machine_id: 0,
          machine_nm: 'IMSP-0001',
          idx_pos: 1,
          status_color: '#db1a1a',
          status_check: 'Normal',
        },
        {
          machine_id: 2,
          machine_nm: 'IMSP-0001',
          idx_pos: 2,
          status_color: '#00ff94',
          status_check: 'Normal',
        },
      ],
    },
  ],
}

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const didMount = useRef(false)

  const [machineDataPreview, setMachineDataPreview] = useState(MachineSummary)
  const [machineDataBlock, setMachineDataBlock] = useState(MachineData)
  const [selectedMachineBlock, setSelectedMachineBlock] = useState()
  const [isWithArea, setIsWithArea] = useState(false)

  useEffect(() => {
    setSelectedMachineBlock(dummy1)
    if (dummy1.childs[0].line_lvl === 'AREA') {
      setIsWithArea(true)
    }
  }, [])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (selectedMachineBlock.childs[0].line_lvl === 'AREA') {
      setIsWithArea(true)
    } else {
      setIsWithArea(false)
    }
  }, [selectedMachineBlock])

  const handleClickSummaryCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))
    setMachineDataPreview(updateData)

    if (item.id < 2) {
      setSelectedMachineBlock(dummy1)
    } else {
      setSelectedMachineBlock(dummy2)
    }

    // const filteredData = machineDataBlock.filter(
    //   (machineBlock) => machineBlock.line_id === item.id,
    // )[0]
  }

  const handleClickMachine = (machine) => {
    navigate(`/dashboard/report`)
    dispatch(setSelectedMachine(machine))
  }

  const ListArea = ({ el, idx }) => (
    <div key={idx}>
      <div style={{ marginTop: '20px' }}>
        <p style={{ textAlign: 'center' }}>{`${el.line_nm}`} </p>
      </div>
      <div className="machineLine">
        {el?.machines?.map((machine, id) => (
          <React.Fragment key={id}>
            <CardCube key={id} value={machine} index={id} onClick={handleClickMachine} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )

  // eslint-disable-next-line react/prop-types
  const List = ({ items }) => {
    return (
      <div className="machineContainer">
        {items?.childs?.map((line, index) => (
          <React.Fragment key={index}>
            {isWithArea ? (
              line?.childs?.map((el, idx) => (
                <React.Fragment key={idx}>
                  <ListArea el={el} idx={idx} />
                </React.Fragment>
              ))
            ) : (
              <ListArea el={line} idx={index} />
            )}
          </React.Fragment>
        ))}
      </div>
    )
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

      <List items={selectedMachineBlock} />
    </>
  )
}

export default Dashboard

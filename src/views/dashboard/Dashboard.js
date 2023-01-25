import React, { useState } from 'react'

import { CCard, CCardBody, CBadge, CCardHeader, CCol, CRow, CCardText } from '@coreui/react'

const Dashboard = () => {
  const initialState = [
    {
      id: 0,
      color: 'white',
      isSelected: true,
      title: 'Cylider Head',
      content: [
        { color: 'danger', total: 5 },
        { color: 'warning', total: 6 },
        { color: 'success', total: 7 },
      ],
    },
    {
      id: 1,
      color: 'white',
      isSelected: false,
      title: 'Cylider Block',
      content: [
        { color: 'danger', total: 5 },
        { color: 'warning', total: 6 },
        { color: 'success', total: 7 },
      ],
    },
    {
      id: 2,
      color: 'white',
      isSelected: false,
      title: 'Cam Shaft',
      content: [
        { color: 'danger', total: 5 },
        { color: 'warning', total: 6 },
        { color: 'success', total: 7 },
      ],
    },
    {
      id: 3,
      color: 'white',
      isSelected: false,
      title: 'Crank Shaft',
      content: [
        { color: 'danger', total: 5 },
        { color: 'warning', total: 6 },
        { color: 'success', total: 7 },
      ],
    },
  ]

  const [machineDataPreview, setMachineDataPreview] = useState(initialState)

  const handleClickCard = (item) => {
    const newData = [...machineDataPreview]
    const updateData = newData.map((el) => ({
      ...el,
      isSelected: item.id === el.id,
    }))

    setMachineDataPreview(updateData)
  }

  return (
    <>
      <CRow>
        {machineDataPreview.map((item, index) => (
          <CCol lg={3} md={3} key={index}>
            <CCard
              color={item.isSelected ? 'info' : item.color}
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
    </>
  )
}

export default Dashboard

import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  CTooltip,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

import {
  MachineCard,
  Cube,
  TopCube,
  BottomCube,
  ContentCube,
  FirstCubeSide,
  SecondCubeSide,
  ThirdCubeSide,
  FourthCubeSide,
  MachineName,
} from './StyledComponent'

const CardCube = ({ value, index, onClick }) => {
  console.log(value)
  return (
    <CTooltip
      content={
        <CTable align="top">
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Nama Mesin</CTableHeaderCell>
              <CTableDataCell>{value.machine_nm}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Status Pengecekan</CTableHeaderCell>
              <CTableDataCell>{value.checked_status}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>Status Penggantian</CTableHeaderCell>
              <CTableDataCell>{value.changes_checmical_status}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      }
      placement="top"
    >
      <MachineCard>
        <div>
          <Cube>
            <TopCube />
            <BottomCube color={value.color_status} />
            <ContentCube>
              <FirstCubeSide
                color={value.color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></FirstCubeSide>
              <SecondCubeSide
                color={value.color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></SecondCubeSide>
              <ThirdCubeSide
                color={value.color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></ThirdCubeSide>
              <FourthCubeSide
                color={value.color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></FourthCubeSide>
            </ContentCube>
          </Cube>
        </div>
        <div>
          <MachineName>{value.machine_nm}</MachineName>
        </div>
      </MachineCard>
    </CTooltip>
  )
}

CardCube.propTypes = {
  value: PropTypes.object,
  onClick: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

CardCube.defaultProps = {
  value: {},
  index: '',
  onClick: () => {},
}

export default CardCube

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
  CTooltip,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
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

import { DARK_THEME } from 'src/utils/helpers'
import CIcon from '@coreui/icons-react'
import { cilColorFill, cilPen } from '@coreui/icons'

const CardCube = ({ value, index, onClick }) => {
  const { theme } = useSelector((state) => state.uiGeneralReducer)
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
      <MachineCard
        bgColor={theme === DARK_THEME ? '#282a33' : '#fff'}
        onClick={() => onClick(value)}
      >
        <div style={{ position: 'absolute', right: '0', top: '-3px', zIndex: 2 }}>
          {!value.is_checked_status &&
          (value.checked_status === 'Warning' || value.checked_status === 'Danger') ? (
            <CBadge color="secondary" size="sm">
              <CIcon icon={cilPen} />
            </CBadge>
          ) : value.is_changes_checmical_status ? (
            <CBadge color="secondary" size="sm">
              <CIcon icon={cilColorFill} />
            </CBadge>
          ) : (
            <CBadge color="transparent" size="sm">
              &nbsp;
            </CBadge>
          )}
        </div>
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

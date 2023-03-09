import React from 'react'
import PropTypes from 'prop-types'

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
  return (
    <CTooltip
      content={
        <CTable align="top">
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>Nama Mesin</CTableHeaderCell>
              <CTableDataCell>{value.machine_nm}</CTableDataCell>
            </CTableRow>
            {/* <CTableRow>
              <CTableHeaderCell>Status Pengecekan</CTableHeaderCell>
              <CTableDataCell>{value.checked_status}</CTableDataCell>
            </CTableRow> */}
            <CTableRow>
              <CTableHeaderCell>Status Penggantian</CTableHeaderCell>
              <CTableDataCell>{value.chemical_changes_msg}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      }
      placement="top"
    >
      <MachineCard
        bgColor={localStorage.getItem('theme') === DARK_THEME ? '#282a33' : '#fff'}
        onClick={() => onClick(value)}
      >
        {value.is_chemical_changes === true && value.is_checked_status === false ? (
          <>
            <div style={{ position: 'absolute', right: '8px', top: '-3px', zIndex: 2 }}>
              <CBadge color="secondary" size="sm">
                <CIcon icon={cilColorFill} />
              </CBadge>
            </div>
            <div style={{ position: 'absolute', right: '0', top: '10px', zIndex: 2 }}>
              <CBadge color="secondary" size="sm">
                <CIcon icon={cilPen} />
              </CBadge>
            </div>
          </>
        ) : value.is_chemical_changes === true && value.is_checked_status === true ? (
          <div style={{ position: 'absolute', right: '0', top: '-3px', zIndex: 2 }}>
            <CBadge color="secondary" size="sm">
              <CIcon icon={cilColorFill} />
            </CBadge>
          </div>
        ) : value.is_chemical_change === false && value.is_checked_status === false ? (
          <div style={{ position: 'absolute', right: '0', top: '-3px', zIndex: 2 }}>
            <CBadge color="secondary" size="sm">
              <CIcon icon={cilPen} />
            </CBadge>
          </div>
        ) : (
          <div style={{ position: 'absolute', right: '0', top: '-3px', zIndex: 2 }}>
            <CBadge color="transparent" size="sm">
              &nbsp;
            </CBadge>
          </div>
        )}
        {/* {value.is_chemical_changes === true && value.is_checked_status === true && }
        { && }
        {(value.is_checked_status === true ||
          value.is_checked_status === null ||
          value.is_chemical_changes) && (
          
        )} */}
        <div>
          <Cube>
            <TopCube />
            <BottomCube color={value.checked_color_status} />
            <ContentCube>
              <FirstCubeSide
                color={value.checked_color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></FirstCubeSide>
              <SecondCubeSide
                color={value.checked_color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></SecondCubeSide>
              <ThirdCubeSide
                color={value.checked_color_status}
                isChangeCemical={value.is_changes_checmical_status}
              ></ThirdCubeSide>
              <FourthCubeSide
                color={value.checked_color_status}
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

import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
  return (
    <MachineCard>
      <div>
        <Cube>
          <TopCube />
          <BottomCube color={value.color_status} />
          <ContentCube>
            <FirstCubeSide color={value.color_status}></FirstCubeSide>
            <SecondCubeSide color={value.color_status}></SecondCubeSide>
            <ThirdCubeSide color={value.color_status}></ThirdCubeSide>
            <FourthCubeSide color={value.color_status}></FourthCubeSide>
          </ContentCube>
        </Cube>
      </div>
      <div>
        <MachineName>{value.machine_nm}</MachineName>
      </div>
    </MachineCard>
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

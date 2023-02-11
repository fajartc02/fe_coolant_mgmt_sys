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
          <BottomCube color={value.status_color} />
          <ContentCube>
            <FirstCubeSide color={value.status_color}></FirstCubeSide>
            <SecondCubeSide color={value.status_color}></SecondCubeSide>
            <ThirdCubeSide color={value.status_color}></ThirdCubeSide>
            <FourthCubeSide color={value.status_color}></FourthCubeSide>
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

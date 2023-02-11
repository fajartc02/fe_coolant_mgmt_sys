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
          <BottomCube color={value.color} />
          <ContentCube>
            <FirstCubeSide color={value.color}></FirstCubeSide>
            <SecondCubeSide color={value.color}></SecondCubeSide>
            <ThirdCubeSide color={value.color}></ThirdCubeSide>
            <FourthCubeSide color={value.color}></FourthCubeSide>
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
  index: PropTypes.string,
}

CardCube.defaultProps = {
  value: {},
  index: '',
  onClick: () => {},
}

export default CardCube

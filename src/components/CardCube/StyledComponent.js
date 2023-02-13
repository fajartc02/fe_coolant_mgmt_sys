import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const animate = keyframes`
  0% {
    transform: rotateX(-30deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-30deg) rotateY(360deg);
  }
`

export const MachineCard = styled.div`
  width: 60px;
  height: 70px;
  padding-top: 8px;
  padding-bottom: 5px;
  padding-right: 2px;
  padding-left: 2px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    box-shadow: 1px 2px 10px #4e4d4d;
    -webkit-transform: translateY(-2px) scale(1.3); /* Chrome, Safari, Opera */
    transform: translateY(-2px) scale(1.3);
    background-color: #fff;
  }

  &:active {
    box-shadow: 0 0 5px #4e4d4d;
    transform: translateY(2px);
    -webkit-transform: scale(1); /* Chrome, Safari, Opera */
    transform: scale(1);
  }
`

export const Cube = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  transform-style: preserve-3d;
  transform: rotateX(-30deg);
  animation: ${animate} 4s linear infinite;
  margin: auto;
`

export const TopCube = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background: #222;
  transform: rotateX(90deg) translateZ(15px);
`
export const BottomCube = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background: ${(props) => props.color};
  transform: rotateX(90deg) translateZ(-24px);
  filter: blur(5px);
`

export const ContentCube = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`

export const FirstCubeSide = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#151515, ${(props) => props.color});
  transform: rotateY(calc(90deg * (0))) translateZ(${30 / 2}px);
`
export const SecondCubeSide = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#151515, ${(props) => props.color});
  transform: rotateY(calc(90deg * 1)) translateZ(${30 / 2}px);
`

export const ThirdCubeSide = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#151515, ${(props) => props.color});
  transform: rotateY(calc(90deg * 2)) translateZ(${30 / 2}px);
`
export const FourthCubeSide = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(#151515, ${(props) => props.color});
  transform: rotateY(calc(90deg * 3)) translateZ(${30 / 2}px);
`

export const MachineName = styled.p`
  text-align: center;
  margin-bottom: 0px;
  font-size: 7px;
  line-height: normal;
  margin-top: 15px;
`

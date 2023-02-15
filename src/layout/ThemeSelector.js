/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector } from 'react-redux'

const LightTheme = React.lazy(() => import('./Theme/LightTheme'))
const DarkTheme = React.lazy(() => import('./Theme/DarkTheme'))
const ThemeSelector = ({ children }) => {
  const { theme } = useSelector((state) => state.uiGeneralReducer)
  return (
    <>
      <React.Suspense fallback={<></>}>
        {theme === 'LIGHT' ? <LightTheme /> : <DarkTheme />}
        {/* {theme === 'DARK' && } */}
      </React.Suspense>
      {children}
    </>
  )
}

export default ThemeSelector

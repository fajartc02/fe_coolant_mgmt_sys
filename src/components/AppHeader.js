import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CButtonGroup,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu, cilSun, cilMoon } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { setIsOpenSidebar, setTheme } from '../stores/actions'

import { DARK_THEME, LIGHT_THEME } from 'src/utils/helpers'

const AppHeader = () => {
  const dispatch = useDispatch()
  const { sidebarShow } = useSelector((state) => state.changeState)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={() => dispatch(setIsOpenSidebar(!sidebarShow))}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>COOLANT MANAGEMENT SYSTEM</CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <CButtonGroup role="group" aria-label="Basic example">
            <CButton
              color="primary"
              onClick={() => {
                dispatch(setTheme(LIGHT_THEME))
                document.body.classList.remove(DARK_THEME)
                localStorage.setItem('theme', LIGHT_THEME)
              }}
            >
              <CIcon icon={cilSun} />
            </CButton>
            <CButton
              color="primary"
              onClick={() => {
                dispatch(setTheme(DARK_THEME))
                document.body.classList.add(DARK_THEME)
                localStorage.setItem('theme', DARK_THEME)
              }}
            >
              <CIcon icon={cilMoon} />
            </CButton>
          </CButtonGroup>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

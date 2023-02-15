import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

import avatar8 from './../../assets/images/person.png'
import { useDispatch } from 'react-redux'
import { setIsLogin } from 'src/stores/actions/login'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Menu</CDropdownHeader>
        <CDropdownItem
          onClick={() => {
            navigate('/login')
            dispatch(setIsLogin(false))
            localStorage.removeItem('token')
          }}
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          LogOut
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

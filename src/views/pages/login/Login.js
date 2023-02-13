import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilNotes } from '@coreui/icons'

// COMPONENTS
import { Loader } from 'src/components'

// API n REDUX
import { postLogin } from '../../../utils/api'
import { setIsLogin } from 'src/stores/actions/login'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [noreg, setNoreg] = useState('1629083')
  const [password, setPassword] = useState('admin123')
  const { isLogin } = useSelector(
    ({ loginReducer }) => ({
      isLogin: loginReducer.isLogin,
    }),
    shallowEqual,
  )

  const { isLoading, mutate } = useMutation(postLogin, {
    onSuccess: ({ data }) => {
      navigate('/dashboard')
      dispatch(setIsLogin(true))
      localStorage.setItem('token', data.token)
    },
    onError: ({ response }) => {
      toast.error(response.data.message)
    },
  })

  const handleChange = (e) => {
    const { target } = e
    if (target.name === 'noreg') {
      setNoreg(target.value)
    } else {
      setPassword(target.value)
    }
  }

  const handleClickLogin = (e) => {
    mutate({
      noreg,
      password,
    })
  }

  useEffect(() => {
    if (isLogin) {
      navigate('/dashboard')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {isLoading && <Loader />}

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilNotes} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="No Registrasi"
                        value={noreg}
                        onChange={handleChange}
                        name="noreg"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        name="password"
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleClickLogin}>
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registrasi</h2>
                    <p>Silakan registrasi terlebih dahulu jika belum mempunyai akun.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Registrasi Sekarang!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

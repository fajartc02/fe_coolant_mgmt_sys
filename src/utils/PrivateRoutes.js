/* eslint-disable react/react-in-jsx-scope */
import { useSelector, shallowEqual } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
  const { isLogin } = useSelector(
    ({ loginReducer }) => ({
      isLogin: loginReducer.isLogin,
    }),
    shallowEqual,
  )

  const token = localStorage.getItem('token')

  return token ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes

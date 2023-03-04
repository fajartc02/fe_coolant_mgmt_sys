import React, { Component, Suspense } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'

import ThemeSelector from 'src/layout/ThemeSelector'

import PrivateRoutes from './utils/PrivateRoutes'
import { DARK_THEME } from './utils/helpers'

// import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  componentDidMount() {
    const theme = localStorage.getItem('theme')

    if (!theme) {
      document.body.classList.add(DARK_THEME)
    } else {
      if (theme && theme === DARK_THEME) {
        document.body.classList.add(DARK_THEME)
      } else {
        document.body.classList.remove(DARK_THEME)
      }
    }
  }
  render() {
    return (
      <Router>
        <ThemeSelector>
          <Suspense fallback={loading}>
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="*" name="Home" element={<DefaultLayout />} />
              </Route>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
            </Routes>
          </Suspense>
        </ThemeSelector>
      </Router>
    )
  }
}

export default App

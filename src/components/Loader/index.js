import React from 'react'
import { CSpinner } from '@coreui/react'
import { LoaderWrap } from './StyledComponent'

const Loader = () => {
  return (
    <LoaderWrap>
      <CSpinner color="dark" variant="grow" />
      <CSpinner color="dark" variant="grow" />
      <CSpinner color="dark" variant="grow" />
      <CSpinner color="dark" variant="grow" />
    </LoaderWrap>
  )
}

export default Loader

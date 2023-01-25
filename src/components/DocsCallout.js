import PropTypes from 'prop-types'
import React from 'react'
import { CCallout } from '@coreui/react'

const DocsCallout = (props) => {
  const { content } = props

  // const _href = `https://coreui.io/react/docs/${href}`

  return (
    <CCallout color="info" className="bg-white">
      {content}
    </CCallout>
  )
}

DocsCallout.propTypes = {
  content: PropTypes.string,
  href: PropTypes.string,
  name: PropTypes.string,
}

export default React.memo(DocsCallout)

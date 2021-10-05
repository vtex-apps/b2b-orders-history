import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['optionDisclaimer']

const Panel = ({ children }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  return (
    <section
      className={`${cssHandles.optionDisclaimer} myo-option-disclaimer br2 mv3 pv5 ph7 bg-muted-5 c-on-muted-5`}
    >
      {children}
    </section>
  )
}
Panel.propTypes = {
  children: PropTypes.any,
}

export default Panel

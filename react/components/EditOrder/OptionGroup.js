import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['optionHeading']

const OptionGroup = ({ name = 'Opções', children }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  return (
    <section className="mv7">
      <h5
        className={`${cssHandles.optionHeading} myo-option-heading f7 tracked c-muted-1 ttu`}
      >
        {name}
      </h5>
      <ul className="list pa0 ma0">{children}</ul>
    </section>
  )
}

OptionGroup.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any.isRequired,
}

export default OptionGroup

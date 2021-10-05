import React from 'react'
import PropTypes from 'prop-types'

import Loader from './Loader'

const Button = ({ children, onClick, color, isLoading }) => {
  const bgColor = `bg-${color}`

  return (
    <button
      className={`dim f7 mv3 pv3 ph5 br2 tc c-on-success ${bgColor}`}
      onClick={onClick}
    >
      {children}
      {isLoading && (
        <span>
          &nbsp;
          <Loader size="small" invert />
        </span>
      )}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
}

Button.defaultProps = {
  color: 'success',
  isLoading: false,
}

export default Button

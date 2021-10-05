import React from 'react'
import PropTypes from 'prop-types'

import loaderSVG from '../../images/loader.svg'
import loaderInvertSVG from '../../images/loaderInvert.svg'

export default function Loader({ children, size, display, invert }) {
  let style
  let sizeNumber
  const svgLoader = invert ? loaderInvertSVG : loaderSVG

  display = children ? 'block' : display

  if (display === 'inline') style = 'dib mh2'
  if (display === 'block') style = 'db center tc'

  if (size === 'small') sizeNumber = 16
  if (size === 'default') sizeNumber = 32
  if (size === 'big') sizeNumber = 64

  return (
    <div className={style}>
      <img
        src={svgLoader}
        height={sizeNumber}
        width={sizeNumber}
        alt="loader"
      />
      {children ? (
        <span className="db f6 bg-muted-1 mt3">{children}</span>
      ) : null}
    </div>
  )
}

Loader.propTypes = {
  children: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'big']),
  display: PropTypes.oneOf(['inline', 'block']),
  invert: PropTypes.bool,
}

Loader.defaultProps = {
  children: '',
  size: 'default',
  display: 'inline',
}

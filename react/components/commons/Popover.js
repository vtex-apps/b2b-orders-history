import React from 'react'
import PropTypes from 'prop-types'

const Popover = ({ children, isOpen }) => {
  const opacityStyle = isOpen ? ' o-100 ' : ' o-0 '

  return (
    <div
      className={`absolute top-2-ns z-5 db ba-ns bb-ns br2 mt3 mt5-ns pa5 f6 b--muted-5 bg-base c-on-base ${opacityStyle}`}
      style={{
        boxShadow: '0px 0px 15px -5px rgba(0,0,0,0.20)',
        transition: 'opacity 0.1s ease-in',
      }}
    >
      {children}
    </div>
  )
}

Popover.propTypes = {
  children: PropTypes.element.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default Popover

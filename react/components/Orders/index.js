import React from 'react'
import PropTypes from 'prop-types'

const Orders = ({ children }) => <section className="ph0">{children}</section>

Orders.propTypes = {
  children: PropTypes.any,
}

export default Orders

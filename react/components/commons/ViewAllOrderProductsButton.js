import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'vtex.my-account-commons/Router'

const ViewAllOrderProductsButton = ({ orderId }) => (
  <Link to={`/orders-history/${orderId}`}>
    <FormattedMessage id="order.viewAllItems" />
  </Link>
)

ViewAllOrderProductsButton.propTypes = {
  orderId: PropTypes.any.isRequired,
}

export default ViewAllOrderProductsButton

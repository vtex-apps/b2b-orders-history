import React from 'react'
import PropTypes from 'prop-types'
import { FormattedNumber } from 'react-intl'

const Price = ({ value, currency }) => (
  <FormattedNumber currency={currency} style="currency" value={value / 100} />
)

Price.propTypes = {
  value: PropTypes.number,
  currency: PropTypes.string,
}

export default Price

import PropTypes from 'prop-types'
import React from 'react'

import Price from './FormattedPrice'

const FinalPrice = props => {
  const { totals, currencyCode } = props

  const fullPrice = totals.reduce((price, total) => price + total.value, 0)

  return <Price value={fullPrice} currency={currencyCode} />
}

FinalPrice.propTypes = {
  totals: PropTypes.arrayOf(PropTypes.object),
  currencyCode: PropTypes.string,
  transactions: PropTypes.arrayOf(PropTypes.object),
}

export default FinalPrice

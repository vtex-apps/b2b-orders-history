import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Price from './FormattedPrice'

const ProductPrice = ({ value, isGift, currency }) => {
  if (isGift) {
    return (
      <small className="ttu">
        <FormattedMessage id="commons.free" />
      </small>
    )
  }

  return <Price value={value} currency={currency} />
}

ProductPrice.propTypes = {
  value: PropTypes.number,
  isGift: PropTypes.bool,
  currency: PropTypes.string,
}

export default ProductPrice

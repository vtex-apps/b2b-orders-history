import React from 'react'
import PropTypes from 'prop-types'

import Price from './FormattedPrice'

const UnitPrice = ({ value, currency, measurementUnit, unitMultiplier }) => {
  const hasFloatUnitMultiplier = !!(unitMultiplier % 1)
  const unitValue = hasFloatUnitMultiplier ? value / unitMultiplier : value

  return (
    <>
      <Price value={unitValue} currency={currency} />
      {hasFloatUnitMultiplier && ` / ${measurementUnit}`}
    </>
  )
}

UnitPrice.propTypes = {
  value: PropTypes.number,
  currency: PropTypes.string,
  measurementUnit: PropTypes.string,
  unitMultiplier: PropTypes.number,
}

export default UnitPrice

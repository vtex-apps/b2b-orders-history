import PropTypes from 'prop-types'
import React from 'react'
import { FormattedNumber, FormattedMessage } from 'react-intl'

const ProductQuantity = ({ quantity, unitMultiplier, measurementUnit }) => {
  const qtd = quantity * unitMultiplier
  const showMeasurementUnit = measurementUnit !== 'un'
  return (
    <>
      {showMeasurementUnit ? (
        <>
          <FormattedNumber value={qtd} maximumFractionDigits={3} />{' '}
          {measurementUnit}
        </>
      ) : (
        <FormattedMessage id="product.quantity" values={{ qtd }} />
      )}
    </>
  )
}

ProductQuantity.propTypes = {
  quantity: PropTypes.number,
  unitMultiplier: PropTypes.number,
  measurementUnit: PropTypes.string,
}

export default ProductQuantity

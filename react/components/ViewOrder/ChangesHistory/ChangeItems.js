import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ProductImage from '../../commons/ProductImage'
import ProductPrice from '../../commons/ProductPrice'
import ProductQuantity from '../../commons/ProductQuantity'

const ChangeItems = ({ items, currencyCode }) => (
  <div className="ba br2 b--muted-4 w-100">
    {items.map((item, i) => {
      const {
        id,
        imageUrl,
        measurementUnit,
        quantity,
        sellingPrice,
        price,
        name,
        unitMultiplier,
      } = item
      const showDivider = i + 1 < items.length

      return (
        <div
          key={id}
          className={`pa6 flex w-100 ${showDivider ? 'bb b--muted-4' : ''}`}
        >
          <div className="w-20">
            {imageUrl && <ProductImage url={imageUrl} />}
          </div>
          <div className="w-80 f6">
            <div className="fw6">{name}</div>
            <div className="pt5">
              {measurementUnit ? (
                <ProductQuantity
                  quantity={quantity}
                  unitMultiplier={unitMultiplier}
                  measurementUnit={measurementUnit}
                />
              ) : (
                <FormattedMessage
                  id="order.change.quantity"
                  values={{ quantity }}
                />
              )}
            </div>
            <div className="pt4 fw6">
              <ProductPrice
                value={sellingPrice || price}
                currency={currencyCode}
              />
            </div>
          </div>
        </div>
      )
    })}
  </div>
)

ChangeItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  currencyCode: PropTypes.string.isRequired,
}

export default ChangeItems

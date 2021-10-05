import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import UnitPrice from '../commons/UnitPrice'
import ProductImage from '../commons/ProductImage'
import Estimate from './Estimate'
import ProductQuantity from '../commons/ProductQuantity'
import ProductName from '../commons/ProductName'

const CSS_HANDLES = [
  'orderProduct',
  'orderProductQuantity',
  'orderProductValue',
  'orderProductShipping',
  'orderProductName',
  'orderProductQuantityValue',
]

class OrderProduct extends Component {
  render() {
    const {
      cssHandles,
      sku: {
        productId,
        imageUrl,
        name,
        detailUrl,
        shippingEstimate,
        shippingEstimateDate,
        unitMultiplier,
        quantity,
        measurementUnit,
        sellingPrice,
      },
      currency,
    } = this.props

    return (
      <div
        className={`${cssHandles.orderProduct} myo-order-product w-100 pb2 pt2 overflow-y-hidden`}
      >
        <div className="v-top dib w-20 h-auto">
          <ProductImage url={imageUrl} alt={name} />
        </div>
        <div className="dib w-80 pl3 c-on-base f6 fw4 lh-copy">
          <h4 className="db mb1 mt0">
            <Link
              to={detailUrl}
              className={`${cssHandles.orderProductName} c-link hover-c-link c-link--visited fw4 f6 f5-l link`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ProductName productId={productId} name={name} />
            </Link>
          </h4>
          <p className={`${cssHandles.orderProductShipping} db mt1 f6`}>
            <Estimate
              shippingEstimate={shippingEstimate}
              shippingEstimateDate={shippingEstimateDate}
            />
          </p>
          <span
            className={`${cssHandles.orderProductQuantityValue} db mt0 mb2 f6 fw6`}
          >
            <span className={`${cssHandles.orderProductQuantity} pr3`}>
              <ProductQuantity
                measurementUnit={measurementUnit}
                quantity={quantity}
                unitMultiplier={unitMultiplier}
              />
            </span>
            <span className={cssHandles.orderProductValue}>
              <UnitPrice
                value={sellingPrice}
                currency={currency}
                measurementUnit={measurementUnit}
                unitMultiplier={unitMultiplier}
              />
            </span>
          </span>
        </div>
      </div>
    )
  }
}

OrderProduct.propTypes = {
  sku: PropTypes.object,
  currency: PropTypes.string,
  cssHandles: PropTypes.object,
}

export default withCssHandles(CSS_HANDLES)(OrderProduct)

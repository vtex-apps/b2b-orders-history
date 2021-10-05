import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import Price from './FormattedPrice'
import OrderSummaryHeader from './OrderSummaryHeader'
import ProductQuantity from './ProductQuantity'
import UnitPrice from './UnitPrice'

const CSS_HANDLES = [
  'summary',
  'summaryProduct',
  'summaryProductQuantity',
  'summaryProductValue',
  'summaryProductName',
  'summaryProductQuantityValue',
]

const OrderSummary = ({ order }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  if (!order || !order.orderId) {
    return null
  }

  const {
    value,
    totals,
    items,
    storePreferencesData: { currencyCode },
    shippingData: { address },
  } = order

  return (
    <article
      className={`${cssHandles.summary} myo-summary w-100 mv5 ba bw1 b--muted-5 overflow-hidden`}
    >
      <OrderSummaryHeader order={order} />
      <div className="pt3 bg-base bt-0">
        {items.map((item, index) => (
          <div
            className={`${cssHandles.summaryProduct} myo-summary-product ph5 pv3 w-100 cf`}
            key={index}
          >
            <div className="dib h-auto w-25 fl">
              <img src={item.imageUrl} alt="Imagem do Produto" />
            </div>
            <div className="dib c-on-base w-75 fr pl2">
              <h4
                className={`${cssHandles.summaryProductName} db c-on-base mb0 fw4 f6 mt0`}
              >
                {item.name}
              </h4>
              <p
                className={`${cssHandles.summaryProductQuantityValue} db mt0 fw4`}
              >
                <span className={`${cssHandles.summaryProductQuantity} pr3`}>
                  <ProductQuantity
                    unitMultiplier={item.unitMultiplier}
                    quantity={item.quantity}
                    measurementUnit={item.measurementUnit}
                  />
                </span>
                <span className={cssHandles.summaryProductValue}>
                  <UnitPrice
                    currency={currencyCode}
                    value={item.sellingPrice}
                    unitMultiplier={item.unitMultiplier}
                    measurementUnit={item.measurementUnit}
                  />
                </span>
              </p>
            </div>
          </div>
        ))}

        <div className="bt bw1 b--muted-5 w-100">
          <div className="pa5">
            <div className="w-100 f6 fw4 c-on-base mb2 ttu">
              <FormattedMessage id="order.shipsTo" />
            </div>
            <div className="w-100 f6 fw6 c-on-base">{address.receiverName}</div>
            <div className="w-100 f6 fw4 c-on-base">
              {address.street}, {address.number}
            </div>
            <div className="w-100 f6 fw4 c-on-base">
              {address.city} - {address.state}
            </div>
            <div className="w-100 f6 fw4 c-on-base">{address.postalCode}</div>
          </div>
        </div>
        <div className="bt bw1 b--muted-5 w-100">
          <div className="pa5">
            <div className="w-100 f6 fw4 c-on-base mb2 ttu">
              <FormattedMessage id="order.total" />
            </div>

            {totals
              .filter(
                total => total.name && total.value !== 0 && total.value !== null
              )
              .map((total, index) => (
                <div className="cf w-100" key={index}>
                  <div className="dib f6 fw4 c-on-base w-60">{total.name}</div>
                  <div className="dib f6 fw4 c-on-base w-40 tr">
                    <Price value={total.value} currency={currencyCode} />
                  </div>
                  <hr className="bt-0 bb bw1 b--muted-5 w-100 mb2 mt2" />
                </div>
              ))}

            <div className="cf w-100 mb7">
              <div className="dib fl f6 fw5 c-on-base w-50">
                <FormattedMessage id="order.total" />
              </div>
              <div className="dib fr f6 fw5 c-on-base w-50 tr">
                <Price value={value} currency={currencyCode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

OrderSummary.propTypes = {
  order: PropTypes.object.isRequired,
}

export default OrderSummary

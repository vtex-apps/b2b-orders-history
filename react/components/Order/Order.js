import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { OrderUtils } from '../../utils'
import ViewAllOrderProductsButton from '../commons/ViewAllOrderProductsButton'
import OrderProduct from './OrderProduct'
import OrderActions from './OrderActions'

const CSS_HANDLES = ['orderBody']

const Order = ({ order, alwaysActive, allowSAC }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const {
    orderId,
    status,
    items = [],
    marketplaceItems = [],
    childOrders,
    storePreferencesData: { currencyCode },
  } = order

  if (
    !alwaysActive &&
    (!OrderUtils.isOrderActive(status) ||
      (childOrders && childOrders.length > 0))
  ) {
    return null
  }

  const MAX_PRODUCTS_SHOWN = 5

  const products =
    marketplaceItems.length === 0
      ? items.slice(0, MAX_PRODUCTS_SHOWN)
      : marketplaceItems.slice(0, MAX_PRODUCTS_SHOWN)

  return (
    <div className={`${cssHandles.orderBody} cf pa5 pa6-l bg-base bt-0`}>
      <div className="fl w-100 w-70-ns">
        {products.map((item, index) => (
          <OrderProduct sku={item} currency={currencyCode} key={index} />
        ))}
        {items && items.length > MAX_PRODUCTS_SHOWN && (
          <ViewAllOrderProductsButton orderId={orderId} />
        )}
      </div>
      <OrderActions order={order} allowSAC={allowSAC} />
    </div>
  )
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
}

export default Order

import PropTypes from 'prop-types'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import ProductPrice from '../../commons/ProductPrice'

const CSS_HANDLES = ['bundleItem']

const BundleItem = props => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { name, price, currencyCode, quantity, isGift } = props
  return (
    <tr
      className={`${cssHandles.bundleItem} myo-bundle-item bt bw1 b--muted-5`}
    >
      <td className="tl v-top pv3 v-mid overflow-hidden">
        <div className="ml3 fl overflow-hidden w-80-ns">
          <p className="fw7 f6 mb0">{name}</p>
        </div>
      </td>
      <td className="pv3 tl v-top dn dtc-ns" />
      <td />
      <td className="pl1 pt3 tl v-top v-mid">
        <ProductPrice
          value={price * quantity}
          currency={currencyCode}
          isGift={isGift}
        />
      </td>
    </tr>
  )
}

BundleItem.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  currencyCode: PropTypes.string,
  quantity: PropTypes.number,
  isGift: PropTypes.bool,
}

export default BundleItem

import PropTypes from 'prop-types'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import ProductPrice from '../../commons/ProductPrice'
import ProductImage from '../../commons/ProductImage'
import UnitPrice from '../../commons/UnitPrice'
import ProductQuantity from '../../commons/ProductQuantity'
import ProductName from '../../commons/ProductName'

const CSS_HANDLES = [
  'productRow',
  'productInfo',
  'productImage',
  'productName',
  'sellerName',
  'productPrice',
  'productQuantity',
  'productTotalPrice',
]

const Product = ({
  id,
  imageUrl,
  detailUrl,
  name,
  sellerName,
  currencyCode,
  quantity,
  measurementUnit,
  unitMultiplier,
  isGift,
  sellingPrice,
}) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  return (
    <tr
      className={`${cssHandles.productRow} myo-product-row bt b--muted-5 bw1`}
    >
      <td
        className={`${cssHandles.productInfo} myo-product-info pv3 tl v-top overflow-hidden`}
      >
        <ProductImage
          className={`${cssHandles.productImage} myo-product-image mw4-ns fl mr5`}
          url={imageUrl}
          alt={name}
        />
        <div className="fl overflow-hidden w-80-ns lh-copy">
          <Link
            to={detailUrl}
            className={`${cssHandles.productName} myo-product-name fw7 f6 mb0 mt0`}
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
            rel="noreferrer"
          >
            <ProductName productId={id} name={name} />
          </Link>
          <span
            className={`${cssHandles.sellerName} myo-seller-name f7 c-muted-1 db`}
          >
            {sellerName}
          </span>
        </div>
      </td>
      <td
        className={`${cssHandles.productPrice} myo-product-price pl2-ns pt3 tl v-top dn dtc-ns`}
      >
        <UnitPrice
          value={sellingPrice}
          currency={currencyCode}
          measurementUnit={measurementUnit}
          unitMultiplier={unitMultiplier}
        />
      </td>
      <td
        className={`${cssHandles.productQuantity} myo-product-quantity pl2-ns pt3 tl v-top`}
      >
        <ProductQuantity
          unitMultiplier={unitMultiplier}
          quantity={quantity}
          measurementUnit={measurementUnit}
        />
      </td>
      <td
        className={`${cssHandles.productTotalPrice} myo-product-total-price pl1-l pt3 tl v-top`}
      >
        <ProductPrice
          value={sellingPrice * quantity}
          isGift={isGift}
          currency={currencyCode}
        />
      </td>
    </tr>
  )
}

Product.propTypes = {
  id: PropTypes.string,
  imageUrl: PropTypes.string,
  detailUrl: PropTypes.string,
  name: PropTypes.string,
  sellerName: PropTypes.string,
  sellingPrice: PropTypes.number,
  currencyCode: PropTypes.string,
  quantity: PropTypes.number,
  unitMultiplier: PropTypes.number,
  measurementUnit: PropTypes.string,
  isGift: PropTypes.bool,
  attachments: PropTypes.array,
}

export default Product

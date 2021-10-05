import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'

import PRODUCT_QUERY from './Product.gql'

function ProductName({ productId, name }) {
  const { data: { productsByIdentifier } = {} } = useQuery(PRODUCT_QUERY, {
    variables: { values: [productId] },
  })

  return <>{productsByIdentifier?.[0].productName ?? name}</>
}

ProductName.propTypes = {
  productId: PropTypes.string,
  name: PropTypes.string,
}

export default ProductName

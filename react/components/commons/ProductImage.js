import React from 'react'
import PropTypes from 'prop-types'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

function ProductImage({ className, url, alt }) {
  return <img className={className} src={fixImageUrl(url)} alt={alt} />
}

ProductImage.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
  alt: PropTypes.string,
}

export default ProductImage

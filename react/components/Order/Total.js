import React from 'react'
import PropTypes from 'prop-types'
import TranslateTotalizer from 'vtex.totalizer-translator/TranslateTotalizer'

import Price from '../commons/FormattedPrice'

const Total = ({ total, currencyCode }) => {
  return (
    <div className="cf w-100" key={total.name}>
      <div className="dib f6 fw4 c-on-base w-60">
        <TranslateTotalizer id={total.id} totalizer={total} />
      </div>
      <div className="dib f6 fw4 c-on-base w-40 tr">
        <Price value={total.value} currency={currencyCode} />
      </div>
      <hr className="bt-0 bb bw1 b--muted-5 w-100 mb2 mt2" />
    </div>
  )
}

Total.propTypes = {
  total: PropTypes.object.isRequired,
  currencyCode: PropTypes.string.isRequired,
}

export default Total

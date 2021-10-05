import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

import { OrderUtils } from '../../utils'
import FormattedDate from './FormattedDate'
import StatusBadge from './StatusBadge'

const CSS_HANDLES = ['summaryHeader']

const OrderSummaryHeader = ({ order }) => {
  const { status, creationDate } = order
  const cssHandles = useCssHandles(CSS_HANDLES)

  const isActive = OrderUtils.isOrderActive(status)
  const activeClasses = isActive ? 'o-100' : 'o-50'

  return (
    <div
      className={`${cssHandles.summaryHeader} myo-summary-header cf pa5 bw1 b--muted-5 bb bg-muted-5 ${activeClasses}`}
    >
      <div className="dib mt2 fl max-w-30 f6 fw5 c-on-muted-5">
        <FormattedDate date={creationDate} style="short" />
      </div>

      <div className="dib v-mid fr max-w-70">
        <StatusBadge order={order} />
      </div>
    </div>
  )
}

OrderSummaryHeader.propTypes = {
  order: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
}

export default OrderSummaryHeader

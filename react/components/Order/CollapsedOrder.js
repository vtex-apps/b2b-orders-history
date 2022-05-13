import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'vtex.my-account-commons/Router'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import FormattedDate from '../commons/FormattedDate'
import StatusBadge from '../commons/StatusBadge'
import { OrderUtils } from '../../utils'

const CSS_HANDLES = [
  'collapsedOrder',
  'orderId',
  'sellerOrderid',
  'orderHeaderLabel',
  'orderHeaderValue',
]

class CollapsedOrder extends Component {
  render() {
    const { cssHandles, order, alwaysActive } = this.props

    if (!order || !order.orderId) {
      return (
        <div className="cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5">...</div>
      )
    }

    const { sellerOrderId, orderId, creationDate, status } = order

    const isActive = alwaysActive || OrderUtils.isOrderActive(status)
    const activeClasses = isActive ? 'o-100' : 'o-40'
    const activeType = isActive ? 'f5-l' : 'f6'

    return (
      <Link
        to={`/orders-history/${orderId}`}
        className={`${cssHandles.collapsedOrder} myo-collapsed-order no-underline db cf w-100 pa5 ph7-ns ba b--muted-4 bg-muted-5 mb3 pointer grow ${activeClasses}`}
      >
        <div className="fl-ns w-50-ns">
          {isActive && (
            <div
              className={`${cssHandles.orderHeaderLabel} w-100 f7 f6-xl fw4 c-muted-1 ttu`}
            >
              <FormattedMessage id="order.dateIs" />
            </div>
          )}
          <div
            className={`${cssHandles.orderHeaderValue} db db-xl pv0 f6 fw5 c-on-base ${activeType}`}
          >
            <FormattedDate date={creationDate} />
          </div>
        </div>

        <div className="fl-ns mt3 mt0-ns w-50-ns">
          <div
            className={`${cssHandles.orderId} myo-order-id mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1`}
          >
            # {orderId}
          </div>
          <div
            className={`${cssHandles.sellerOrderid} myo-seller-orderid dn mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1`}
          >
            # {sellerOrderId}
          </div>
          {isActive && (
            <div className="tr-ns mt2-ns">
              <StatusBadge order={order} />
            </div>
          )}
        </div>
      </Link>
    )
  }
}

CollapsedOrder.propTypes = {
  order: PropTypes.object,
  alwaysActive: PropTypes.bool,
  cssHandles: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  order: state.myOrders.orders[ownProps.orderId],
})

const enhance = compose(connect(mapStateToProps), withCssHandles(CSS_HANDLES))

export default enhance(CollapsedOrder)

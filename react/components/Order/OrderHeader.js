import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import { withCssHandles } from 'vtex.css-handles'

import FormattedDate from '../commons/FormattedDate'
import StatusBadge from '../commons/StatusBadge'
import FinalPrice from '../commons/FinalPrice'
import PaymentFlagIcon from '../commons/PaymentFlagIcon'
import { OrderUtils } from '../../utils'

const CSS_HANDLES = [
  'orderHeader',
  'orderId',
  'sellerOrderId',
  'orderHeaderLabel',
  'orderHeaderValue',
]

class OrderHeader extends Component {
  constructor(props) {
    super(props)

    const order = this.mapOrder(this.props.order)

    this.state = {
      order,
    }
  }

  mapOrder(order = {}) {
    return {
      ...order,
      isAddressPopoverOpen: false,
    }
  }

  handlePopoverOuterAction = () => {
    this.setState({
      order: {
        ...this.state.order,
        isAddressPopoverOpen: false,
      },
    })
  }

  handlePopoverTrigger = () => {
    this.setState({
      order: {
        ...this.state.order,
        isAddressPopoverOpen: true,
      },
    })
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(newProps) {
    if (!newProps.order) {
      return false
    }

    this.setState({
      order: this.mapOrder(newProps.order),
    })
  }

  render() {
    const { order } = this.state
    const { alwaysActive, cssHandles } = this.props

    if (!order || !order.orderId) {
      return (
        <div className="cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5">...</div>
      )
    }

    const {
      sellerOrderId,
      orderId,
      creationDate,
      status,
      totals,
      paymentData,
      storePreferencesData: { currencyCode },
    } = order

    const paymentMethods = uniq(
      flatten(
        map(paymentData.transactions, transaction =>
          map(transaction.payments, payment => payment)
        )
      ),
      'paymentSystem'
    )

    const isActive = alwaysActive || OrderUtils.isOrderActive(status)
    const activeClasses = isActive ? 'o-100' : 'o-40'
    const activeType = isActive ? 'f5-l' : 'f6'

    return (
      <div
        className={`${cssHandles.orderHeader} myo-order-header cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5 lh-copy ${activeClasses}`}
      >
        <div className="fl db w-25-ns w-50-s">
          {isActive && (
            <div
              className={`${cssHandles.orderHeaderLabel} w-100 f7 f6-xl fw4 c-muted-1 ttu`}
            >
              <FormattedMessage id="order.dateIs" />
            </div>
          )}
          <div
            className={`${cssHandles.orderHeaderValue} db pv0 f6 fw5 c-on-base ${activeType}`}
          >
            <FormattedDate date={creationDate} />
          </div>
        </div>

        <div className="fr fl-ns w-50">
          {isActive && (
            <div
              className={`${cssHandles.orderHeaderLabel} db w-100 f7 f6-xl fw4 c-muted-1 ttu tr tl-ns`}
            >
              <FormattedMessage id="order.total" />
            </div>
          )}
          <div
            className={`${cssHandles.orderHeaderValue} db w-100 f6 fw5 c-muted-1 tr tl-ns ${activeType}`}
          >
            <FinalPrice
              totals={totals}
              currencyCode={currencyCode}
              transactions={paymentData.transactions}
            />
            <div className="absolute dn dib-ns ml3 mt2">
              {paymentMethods &&
                paymentMethods.map(({ paymentSystemName, id, group }) => (
                  <PaymentFlagIcon
                    type={paymentSystemName}
                    group={group}
                    size={400}
                    key={id}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="fl mt3 mt0-ns w-25-ns w-100-s">
          <div
            className={`${cssHandles.orderId} myo-order-id mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1`}
          >
            # {orderId}
          </div>
          <div
            className={`${cssHandles.sellerOrderId} myo-seller-order-id dn mb3 mb0-xl tl tr-ns f7 f6-xl fw4 c-muted-1`}
          >
            # {sellerOrderId}
          </div>
          {isActive && (
            <div className="tr-ns mt2-ns">
              <StatusBadge order={order} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

OrderHeader.propTypes = {
  order: PropTypes.object,
  alwaysActive: PropTypes.bool,
  cssHandles: PropTypes.object,
}

export default withCssHandles(CSS_HANDLES)(OrderHeader)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import kebabCase from 'lodash/kebabCase'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import OrderUtils from '../../utils/OrderUtils'
import Order from './Order'
import OrderHeader from './OrderHeader'
import CollapsedOrder from './CollapsedOrder'

const CSS_HANDLES = ['orderCard']

class DetailedOrder extends Component {
  render() {
    const { cssHandles, orderData, allowSAC, alwaysActive } = this.props

    if (!orderData) {
      return (
        <CollapsedOrder
          orderId={this.props.orderId}
          alwaysActive={alwaysActive}
        />
      )
    }
    const order = OrderUtils.mapOrder(orderData)
    return (
      <article
        className={`${cssHandles.orderCard} myo-order-card w-100 mv7 ba overflow-hidden b--muted-4`}
        key={order.orderId}
        status={kebabCase(order.status)}
      >
        <OrderHeader
          order={order}
          alwaysActive={alwaysActive}
          key={order.orderId}
        />
        <Order order={order} allowSAC={allowSAC} alwaysActive={alwaysActive} />
      </article>
    )
  }
}

DetailedOrder.propTypes = {
  orderData: PropTypes.object,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
  orderId: PropTypes.string,
  cssHandles: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  orderData: state.myOrders.detailedOrders[ownProps.orderId],
})

const enhance = compose(connect(mapStateToProps), withCssHandles(CSS_HANDLES))

export default enhance(DetailedOrder)

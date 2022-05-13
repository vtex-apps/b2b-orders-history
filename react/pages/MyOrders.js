import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ContentWrapper } from 'vtex.my-account-commons'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import Orders from '../components/Orders'
import OrdersList from '../components/Order/OrdersList'
import scrollKeeper from '../utils/scrollKeeper'
import Greeting from '../components/commons/Greeting'
import Empty from '../components/Orders/EmptyState'
import { fetchOrders } from '../actions/order-actions'
import Loader from '../components/commons/Loader'
import Error from '../components/commons/Error'
import { logAccountName } from '../utils/splunk'

const CSS_HANDLES = ['ordersList']

class MyOrders extends Component {
  componentDidMount() {
    if (!this.props.userOrders) {
      this.props.fetchOrders()
    }

    scrollKeeper.restorePagePositions('orders')
    window.addEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
    if (window.__RUNTIME__.workspace === 'master') {
      logAccountName()
    }
  }

  headerConfig = () => {
    const { cssHandles } = this.props

    return {
      titleId: 'orders.title',
      namespace: `${cssHandles.ordersList} vtex-account__orders-list`,
    }
  }

  handleCustomerImpersonation = () => {
    this.props.fetchOrders()
  }

  componentWillUnmount() {
    scrollKeeper.savePagePositions('orders')
    window.removeEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  render() {
    const { allowSAC, userOrders, isLoading, ordersError } = this.props

    const renderWrapper = children => {
      return (
        <ContentWrapper {...this.headerConfig()}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (ordersError) return renderWrapper(<Error error={ordersError} />)

    if (isLoading || !userOrders) {
      return renderWrapper(
        <div className="w-100 pt6 tc">
          <Loader size="small" />
        </div>
      )
    }

    const emptyOrders = !userOrders.length

    return renderWrapper(
      <div className="center w-100 helvetica">
        <Greeting
          param="replacedOrder"
          variation="primary"
          greetingId="greeting.replaced"
        />
        <Greeting
          param="canceledOrder"
          variation="alert"
          greetingId="greeting.cancelled"
        />
        {emptyOrders ? (
          <Empty />
        ) : (
          <Orders>
            <OrdersList orders={userOrders} allowSAC={allowSAC} />
          </Orders>
        )}
      </div>
    )
  }
}

MyOrders.propTypes = {
  fetchOrders: PropTypes.func.isRequired,
  orders: PropTypes.object,
  userOrders: PropTypes.array,
  detailedOrders: PropTypes.object,
  ordersError: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  allowSAC: PropTypes.bool,
  cssHandles: PropTypes.object,
}

const mapStateToProps = state => ({
  orders: state.myOrders.orders,
  userOrders: state.myOrders.userOrders,
  detailedOrders: state.myOrders.detailedOrders,
  ordersError: state.myOrders.ordersError,
  isLoading: state.myOrders.isLoading,
})

const enhance = compose(
  connect(mapStateToProps, {
    fetchOrders,
  }),
  withCssHandles(CSS_HANDLES)
)

export default enhance(MyOrders)

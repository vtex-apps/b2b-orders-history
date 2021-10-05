import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'

import { fetchMoreOrders } from '../../actions/order-actions'
import Loader from '../commons/Loader'
import DetailedOrder from './DetailedOrder'

class OrdersList extends Component {
  loadMore = () => {
    if (this.props.hasMore) {
      this.props.fetchMoreOrders(String(this.props.currentPage + 1))
    }
  }

  render() {
    const { orders, hasMore, alwaysActive, allowSAC, currentPage } = this.props
    return (
      <InfiniteScroll
        loadMore={this.loadMore}
        hasMore={hasMore}
        loader={<Loader key={currentPage + 1} display="block" size="small" />}
      >
        {orders.map(orderId => (
          <DetailedOrder
            key={orderId}
            orderId={orderId}
            alwaysActive={alwaysActive}
            allowSAC={allowSAC}
          />
        ))}
      </InfiniteScroll>
    )
  }
}

OrdersList.defaultProps = {
  alwaysActive: true,
}

OrdersList.propTypes = {
  orders: PropTypes.array,
  alwaysActive: PropTypes.bool,
  allowSAC: PropTypes.bool,
  hasMore: PropTypes.bool,
  currentPage: PropTypes.number,
  fetchMoreOrders: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  hasMore: state.myOrders.currentPage < state.myOrders.pages,
  currentPage: state.myOrders.currentPage,
})

export default connect(mapStateToProps, {
  fetchMoreOrders,
})(OrdersList)

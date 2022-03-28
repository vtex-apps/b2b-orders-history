import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import { connect } from 'react-redux'
import { ContentWrapper } from 'vtex.my-account-commons'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import OrderSummary from '../components/commons/OrderSummary'
import OptionGroup from '../components/EditOrder/OptionGroup'
import Option from '../components/EditOrder/Option'
import Panel from '../components/commons/Panel'
import OptionGroupDisclaimer from '../components/EditOrder/OptionGroupDisclaimer'
import GoButton from '../components/commons/Button'
import Loader from '../components/commons/Loader'
import Error from '../components/commons/Error'
import {
  fetchOrderAndReasons,
  getCancellationReasons,
  fetchOrders,
  cancelOrder,
} from '../actions/order-actions'

const CSS_HANDLES = ['cancelOrder']

class CancelOrder extends Component {
  state = {
    selectedOption: {},
    selectedOptionGroup: {},
    otherReason: null,
  }

  headerConfig = ({ intl, order }) => {
    const { cssHandles } = this.props
    const orderTitle = intl.formatMessage({ id: 'order' })
    const orderNumber = order && order.orderId ? `#${order.orderId}` : ''
    const backButton = {
      titleId: 'orders.title',
      path: '/orders-history',
    }

    return {
      title: `${orderTitle} ${orderNumber}`,
      backButton,
      namespace: `${cssHandles.cancelOrder} vtex-account__cancel-order`,
    }
  }

  handleCancelOrder = () => {
    const {
      order: { orderId },
    } = this.props

    const {
      selectedOption: { label, value },
      otherReason,
    } = this.state

    let reason

    if (value === 'other') {
      reason = otherReason || value
    } else if (value && value.length) {
      reason = value
    } else {
      reason = label
    }

    this.props.cancelOrder(orderId, reason)
  }

  goToHomePage = () => {
    window.browserHistory.push('/orders')
  }

  handleLegacyPageChange = (event, page) => {
    if (page === 'orders') {
      return this.goToHomePage()
    }
  }

  handleChange = (option, groupName) => {
    this.setState({
      selectedOption: option,
      selectedOptionGroup: this.props.cancellationOptions.groups.find(
        group => group.name === groupName
      ),
      otherReason: null,
    })
  }

  handleOtherReasonChange = event => {
    const { value } = event.target

    this.setState({
      otherReason: value,
    })
  }

  isDisclaimerPanelOpen = (groupName, optionLabel) => {
    const {
      selectedOptionGroup: { name },
      selectedOption: { label },
    } = this.state

    return name === groupName && label === optionLabel
  }

  loadOptions = () => {
    const { order, intl } = this.props

    if (order.allowCancellation) {
      this.props.getCancellationReasons(intl.locale, order)
    } else {
      this.goToHomePage()
    }
  }

  componentDidMount() {
    const { match, intl, order } = this.props

    if (!order) {
      this.props.fetchOrderAndReasons(
        match.params.orderId,
        intl.locale,
        'cancellation'
      )
    } else {
      this.loadOptions()
    }

    window.addEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
    window.scrollTo(0, 0)
  }

  handleCustomerImpersonation = () => {
    this.props.fetchOrders()
    this.goToHomePage()
  }

  componentWillUnmount() {
    window.removeEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  componentDidUpdate(prevProps) {
    const { match, intl } = this.props

    if (prevProps.match.params.orderId !== match.params.orderId) {
      this.props.fetchOrderAndReasons(
        match.params.orderId,
        intl.locale,
        'cancellation'
      )
    }

    const { order } = this.props

    if (order && !order.allowCancellation) {
      this.goToHomePage()
    }
  }

  render() {
    const { selectedOption, selectedOptionGroup } = this.state
    const { isSubmitting } = this.props

    const {
      intl,
      order,
      isLoading,
      orderError,
      cancellationOptions,
      hasFetchedCancellationOptions,
      cancellationReasonsError,
    } = this.props

    const error = orderError || cancellationReasonsError

    const renderWrapper = children => {
      return (
        <ContentWrapper {...this.headerConfig({ order, intl })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (error) {
      return renderWrapper(<Error error={error} />)
    }

    if (isLoading || !order) {
      return renderWrapper(
        <div className="w-100 pt6 tc">
          <Loader size="small" />
        </div>
      )
    }

    const {
      clientProfileData: { firstName },
    } = order

    const otherReasonTextarea = selectedOption &&
      selectedOption.value === 'other' && (
        <form className="pv5">
          <label className="f6 lh-copy c-on-base" htmlFor="cancelReason">
            <FormattedMessage id="commons.reasonOtherExplanation" />
          </label>
          <textarea
            id="cancelReason"
            autoComplete="off"
            className="w-100 mt2 h4"
            style={{ resize: 'vertical' }}
            onChange={this.handleOtherReasonChange}
          />
        </form>
      )

    return renderWrapper(
      <div className="center w-100 cf">
        <aside className="w-100 w-30-xl fr-xl">
          <OrderSummary order={order} />
        </aside>

        <section className="w-100 w-70-xl fl-xl pr9">
          <p className="db f3 c-on-base mb3">
            <FormattedMessage id="commons.hello" />, {firstName}
          </p>
          <p className="f4 c-on-base lh-copy mt7">
            <FormattedMessage id="pages.cancelOrder.greeting" />
          </p>

          {!hasFetchedCancellationOptions && (
            <Fragment>
              <br />
              <Loader size="small" />
            </Fragment>
          )}

          {hasFetchedCancellationOptions &&
            cancellationOptions.groups.map(optionGroup => (
              <OptionGroup name={optionGroup.name} key={optionGroup.name}>
                {optionGroup.options.map(option => (
                  <div key={option.label}>
                    <Option
                      option={option}
                      groupName={optionGroup.name}
                      id={`${optionGroup.name}-${option.label}`}
                      onChange={this.handleChange}
                    />
                    {this.isDisclaimerPanelOpen(
                      optionGroup.name,
                      option.label
                    ) && (
                      <Fragment>
                        {otherReasonTextarea}
                        <Panel>
                          <OptionGroupDisclaimer group={selectedOptionGroup} />
                          <GoButton
                            type="primary"
                            color="danger"
                            onClick={this.handleCancelOrder}
                            isLoading={isSubmitting}
                          >
                            <FormattedMessage id="order.confirmCancellation" />
                          </GoButton>
                        </Panel>
                      </Fragment>
                    )}
                  </div>
                ))}
              </OptionGroup>
            ))}
        </section>
      </div>
    )
  }
}

CancelOrder.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  order: PropTypes.object,
  isLoading: PropTypes.bool,
  orderError: PropTypes.object,
  fetchOrderAndReasons: PropTypes.func.isRequired,
  getCancellationReasons: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  cancellationOptions: PropTypes.object,
  hasFetchedCancellationOptions: PropTypes.bool,
  cancellationReasonsError: PropTypes.object,
  isSubmitting: PropTypes.bool,
  intl: intlShape,
  cssHandles: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  order: state.myOrders.detailedOrders[ownProps.match.params.orderId],
  isLoading: state.myOrders.isLoading,
  orderError: state.myOrders.orderError,
  cancellationOptions: state.myOrders.options,
  hasFetchedCancellationOptions: state.myOrders.hasFetchedCancellationOptions,
  cancellationReasonsError: state.myOrders.cancellationReasonsError,
  isSubmitting: state.myOrders.isSubmittingOrderCancellation,
})

const enhance = compose(
  connect(mapStateToProps, {
    fetchOrderAndReasons,
    getCancellationReasons,
    fetchOrders,
    cancelOrder,
  }),
  withCssHandles(CSS_HANDLES),
  injectIntl
)

export default enhance(CancelOrder)

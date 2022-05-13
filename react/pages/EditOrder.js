import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import { ContentWrapper } from 'vtex.my-account-commons'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import Loader from '../components/commons/Loader'
import OrderSummary from '../components/commons/OrderSummary'
import OptionGroup from '../components/EditOrder/OptionGroup'
import Option from '../components/EditOrder/Option'
import Panel from '../components/commons/Panel'
import OptionGroupDisclaimer from '../components/EditOrder/OptionGroupDisclaimer'
import GoButton from '../components/commons/Button'
import {
  fetchOrderAndReasons,
  getReplacementReasons,
  redirect,
  fetchOrders,
} from '../actions/order-actions'
import Error from '../components/commons/Error'

const CSS_HANDLES = ['editOrder']

class EditOrder extends Component {
  state = {
    selectedOption: {},
    selectedOptionGroup: {},
  }

  headerConfig = ({ order, intl }) => {
    const { cssHandles } = this.props
    const orderTitle = intl.formatMessage({ id: 'orders.title' })
    const orderNumber = order && order.orderId ? `#${order.orderId}` : ''
    const backButton = {
      title:
        order && order.orderId
          ? intl.formatMessage(
              { id: 'orders.edit' },
              { orderNumber: order.orderId }
            )
          : orderTitle,
      path:
        order && order.orderId
          ? `/orders-history/${order.orderId}`
          : '/orders-history',
    }

    return {
      title: `${orderTitle} ${orderNumber}`,
      backButton,
      namespace: `${cssHandles.editOrder} vtex-account__edit-order`,
    }
  }

  goToHomePage = () => {
    this.props.history.push('/orders-history')
  }

  handleChange = (option, groupName) => {
    this.setState({
      selectedOption: option,
      selectedOptionGroup: this.props.replacementOptions.groups.find(
        group => group.name === groupName
      ),
    })
  }

  isDisclaimerPanelOpen = (groupName, optionLabel) => {
    const {
      selectedOptionGroup: { name },
      selectedOption: { label },
    } = this.state
    return name === groupName && label === optionLabel
  }

  handleRedirectClick = () => {
    const {
      order: { orderId },
    } = this.props

    const {
      selectedOptionGroup: { id },
    } = this.state

    this.props.redirect(orderId, id)
  }

  loadOptions = () => {
    const { order, intl } = this.props
    if (order.allowEdition) {
      this.props.getReplacementReasons(intl.locale, order)
    } else {
      this.goToHomePage()
    }
  }

  componentDidMount() {
    const { order, match, intl } = this.props

    if (!order) {
      this.props.fetchOrderAndReasons(
        match.params.orderId,
        intl.locale,
        'replacement'
      )
    } else {
      this.loadOptions()
    }
    window.addEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  componentWillUnmount() {
    window.removeEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  handleCustomerImpersonation = () => {
    this.props.fetchOrders()
    this.goToHomePage()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.orderId !== this.props.match.params.orderId) {
      this.props.fetchOrderAndReasons(
        this.props.match.params.orderId,
        prevProps.intl.locale,
        'replacement'
      )
      window.scrollTo(0, 0)
    }

    const {
      order,
      hasFetchedReplacementOptions,
      replacementOptions,
    } = this.props

    if (
      (order && !order.allowEdition) ||
      (hasFetchedReplacementOptions &&
        replacementOptions &&
        replacementOptions.length === 0)
    ) {
      this.goToHomePage()
    }
  }

  render() {
    const { selectedOptionGroup } = this.state
    const {
      intl,
      order,
      isLoading,
      orderError,
      isSubmitting,
      replacementOptions,
      hasFetchedReplacementOptions,
      replacementReasonsError,
    } = this.props

    const error = orderError || replacementReasonsError

    const renderWrapper = children => {
      return (
        <ContentWrapper {...this.headerConfig({ intl, order })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (error) return renderWrapper(<Error error={error} />)

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

    return renderWrapper(
      <div className="center w-100 cf">
        <aside className="w-100 w-30-xl fr-xl">
          <OrderSummary order={order} />
        </aside>

        <section className="mt5 w-100 w-70-xl fl-xl pr9">
          <p className="db f3 c-on-base mb3">
            <FormattedMessage id="commons.hello" />, {firstName}
          </p>
          <p className="f4 c-on-base lh-copy mt7">
            <FormattedMessage id="pages.editOrder.greeting" />
          </p>
          {!hasFetchedReplacementOptions && (
            <div>
              <Loader size="small" />
            </div>
          )}
          {hasFetchedReplacementOptions &&
            replacementOptions.groups.map(optionGroup => (
              <OptionGroup name={optionGroup.name} key={optionGroup.name}>
                {optionGroup.options.map(option => (
                  <div key={option.label}>
                    <Option
                      disabled={!optionGroup.enabled}
                      option={option}
                      groupName={optionGroup.name}
                      id={`${optionGroup.name} -${option.label} `}
                      onChange={this.handleChange}
                    />
                    {this.isDisclaimerPanelOpen(
                      optionGroup.name,
                      option.label
                    ) && (
                      <Panel>
                        <OptionGroupDisclaimer group={selectedOptionGroup} />
                        <GoButton
                          type="primary"
                          onClick={this.handleRedirectClick}
                          isLoading={isSubmitting}
                        >
                          <FormattedMessage id="commons.continue" />
                        </GoButton>
                      </Panel>
                    )}
                  </div>
                ))}
                {!optionGroup.enabled ? (
                  <strong className="db mt3 pv5 ph7 br2 bg-muted-5 c-on-muted-5 lh-solid">
                    <FormattedMessage id="pages.editOrder.changeUnavailable" />
                  </strong>
                ) : null}
              </OptionGroup>
            ))}
        </section>
      </div>
    )
  }
}

EditOrder.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  fetchOrderAndReasons: PropTypes.func.isRequired,
  order: PropTypes.object,
  isLoading: PropTypes.bool,
  orderError: PropTypes.object,
  getReplacementReasons: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  replacementOptions: PropTypes.object,
  hasFetchedReplacementOptions: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  replacementReasonsError: PropTypes.object,
  intl: intlShape,
  cssHandles: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  order: state.myOrders.detailedOrders[ownProps.match.params.orderId],
  isLoading: state.myOrders.isLoading,
  orderError: state.myOrders.orderError,
  replacementOptions: state.myOrders.replacementOptions,
  hasFetchedReplacementOptions: state.myOrders.hasFetchedReplacementOptions,
  isSubmitting: state.myOrders.isSubmitting,
  replacementReasonsError: state.myOrders.replacementReasonsError,
})

const enhance = compose(
  connect(mapStateToProps, {
    fetchOrderAndReasons,
    getReplacementReasons,
    redirect,
    fetchOrders,
  }),
  withCssHandles(CSS_HANDLES),
  injectIntl
)

export default enhance(EditOrder)

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import ReactRouterPropTypes from 'react-router-prop-types'
import packagify from '@vtex/delivery-packages'
import {
  ContentWrapper,
  utils,
  ProgressBarBundle,
} from 'vtex.my-account-commons'
import { withCssHandles } from 'vtex.css-handles'
import { compose } from 'recompose'

import { OrderUtils } from '../utils'
import Address from '../components/commons/Address'
import Price from '../components/commons/FormattedPrice'
import FormattedDate from '../components/commons/FormattedDate'
import PaymentFlagIcon from '../components/commons/PaymentFlagIcon'
import PaymentConnectorResponses from '../components/commons/PaymentConnectorResponses'
import StatusBadge from '../components/commons/StatusBadge'
import TrackingDataSpoiler from '../components/commons/TrackingDataSpoiler'
import OrderButtons from '../components/ViewOrder/OrderButtons'
import ReplacementHistory from '../components/ViewOrder/ReplacementHistory'
import ChangesHistory from '../components/ViewOrder/ChangesHistory'
import getDeliveryName from '../utils/getDeliveryName'
import {
  fetchOrder,
  fetchParentOrders,
  fetchOrders,
} from '../actions/order-actions'
import Totals from '../components/Order/Totals'
import Error from '../components/commons/Error'
import Loader from '../components/commons/Loader'
import Products from '../components/Order/Products/index'
import TrackingProgress from '../components/commons/TrackingProgress'
import InvoiceDataSpoiler from '../components/commons/InvoiceDataSpoiler'

const CSS_HANDLES = ['orderDetails', 'invoiceBtn', 'marginRight']

const { estimateShipping } = utils
const {
  ProgressBarSection,
  PackageProgressBarSection,
  OrderStatus,
  PackageStatus,
  utils: { generatePackageProgressBarStates, generateProgressBarStates },
  constants: { progressBarStates, packageProgressBarStates },
} = ProgressBarBundle

class ViewOrder extends Component {
  state = {
    showAdditionalPaymentData: false,
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
      backButton,
      title: `${orderTitle} ${orderNumber}`,
      namespace: `${cssHandles.orderDetails} vtex-account__order-details`,
    }
  }

  componentDidMount() {
    if (!this.props.order) {
      this.props.fetchOrder(this.props.match.params.orderId, true)
    } else {
      this.props.fetchParentOrders(this.props.order, [])
    }

    window.addEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.orderId !== this.props.match.params.orderId) {
      this.props.fetchOrder(this.props.match.params.orderId, true)
    }

    window.scrollTo(0, 0)
  }

  handleCustomerImpersonation = () => {
    this.props.fetchOrders()
    this.goToHomePage()
  }

  goToHomePage = () => {
    window.browserHistory.push('/orders-history')
  }

  componentWillUnmount() {
    window.removeEventListener(
      'callcenterOperator.setCustomer.vtex',
      this.handleCustomerImpersonation
    )
  }

  handleAdditionalPaymentDataClick = () => {
    this.setState(state => {
      return {
        showAdditionalPaymentData: !state.showAdditionalPaymentData,
      }
    })
  }

  render() {
    const { showAdditionalPaymentData } = this.state
    const { cssHandles, order, orderError, isLoading, intl } = this.props

    const renderWrapper = children => {
      return (
        <ContentWrapper {...this.headerConfig({ order, intl })}>
          {() => children}
        </ContentWrapper>
      )
    }

    if (orderError) return renderWrapper(<Error error={orderError} />)

    if (isLoading || !order) {
      return renderWrapper(
        <div className="w-100 pt6 tc">
          <Loader size="small" />
        </div>
      )
    }

    if (!order || !order.orderId) {
      return null
    }

    const {
      paymentData,
      status,
      creationDate,
      totals,
      shippingData: { address },
      storePreferencesData: { currencyCode },
      paymentData: { transactions },
      allowCancellation,
      sellers,
      changesAttachment,
      items,
    } = order

    const bankInvoiceUrl = OrderUtils.getBankInvoiceUrl(transactions)

    const showPrintBankInvoiceButton = allowCancellation && bankInvoiceUrl
    const packages = packagify(order)

    const hasProductChanges = changesAttachment && changesAttachment.changesData
    const hasReplacement = this.props.history && this.props.history.length > 0

    return renderWrapper(
      <div className="center w-100 show-on-print-container">
        <div className="fl w-40-ns pv3 pl0 show-on-print">
          <time className="c-on-base">
            <FormattedDate date={creationDate} style="long" />{' '}
            <StatusBadge order={order} />
          </time>
        </div>

        <div className="w-100 fl w-60-ns pv3-ns pr0 hide-on-print">
          <OrderButtons order={order} allowSAC />
        </div>

        <section className="w-100 fl mt5 mb2-l mb2-xl show-on-print">
          <article className="w-100 fl w-third-m pr3-m mb5">
            <section className="pa5 ba bw1 b--muted-5 h4-plus overflow-y-scroll bg-base">
              <h3 className="c-on-base mt2 mb5 tracked-mega lh-solid ttu f6">
                <FormattedMessage id="order.shippingInfo" />
              </h3>
              <Address address={address} />
            </section>
          </article>
          <article className="w-100 fl w-third-m pr3-m mb5">
            <section className="pa5 ba bw1 b--muted-5 overflow-y-scroll bg-base h4-plus">
              <h3 className="c-on-base mt2 mb5 tracked-mega lh-solid ttu f6">
                <FormattedMessage id="order.paymentInfo" />
              </h3>
              {paymentData &&
                paymentData.transactions.length > 0 &&
                paymentData.transactions[0].payments.map(
                  ({
                    paymentSystemName,
                    id,
                    giftCard,
                    group,
                    lastDigits,
                    value,
                    installments,
                    connectorResponses,
                  }) => (
                    <div className="mb5" key={id}>
                      <PaymentFlagIcon
                        alignFix
                        type={paymentSystemName}
                        size={400}
                        group={group}
                      />
                      <div className="dib ma0 pa0 f6 lh-copy">
                        <Fragment>
                          <FormattedMessage
                            id={
                              giftCard
                                ? `paymentData.giftCard.${giftCard.name}.name`
                                : `paymentData.paymentGroup.${group}.name`
                            }
                            defaultMessage={paymentSystemName}
                          />
                          {group === 'creditCard' && (
                            <span>
                              {` ${intl.formatMessage({
                                id:
                                  'paymentData.paymentGroup.creditCard.endingIn',
                              })} ${lastDigits}`}
                            </span>
                          )}
                        </Fragment>
                        &nbsp;
                        <div className={group === 'creditCard' ? 'db' : 'dib'}>
                          <Price value={value} currency={currencyCode} />
                          <span className="fw5">{` (${installments} x)`}</span>
                        </div>
                        {Object.keys(connectorResponses || {}).length > 0 && (
                          <PaymentConnectorResponses
                            data={connectorResponses || {}}
                            isOpen={showAdditionalPaymentData}
                            onClick={this.handleAdditionalPaymentDataClick}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              {showPrintBankInvoiceButton && (
                <a
                  href={bankInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cssHandles.invoiceBtn} myo-invoice-btn fr cf db link tl mt3 pv2 br2 w-100 f6 fw4`}
                >
                  <button
                    className="fl dib ba bw1 b--muted-4 br-pill hh2 w2 lh-solid bg-base hover-bg-action-secondary"
                    style={{
                      boxShadow: '0px 0px 15px -5px rgba(0,0,0,0.20)',
                    }}
                  >
                    <svg
                      className="hh1 w1"
                      viewBox="0 0 17 17"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path
                          d="M15.895 0H1.105C.495 0 0 .66 0 1.477v14.046C0 16.34.494 17 1.104 17h14.79c.61 0 1.106-.66 1.106-1.477V1.477C17 .66 16.505 0 15.895 0z"
                          fill="#555"
                        />
                        <path
                          fill="#FFF"
                          d="M13 3h2v11h-2zm-2 0h1v11h-1zM7 3h3v11H7zM4 3h2v11H4zM2 3h1v11H2z"
                        />
                      </g>
                    </svg>
                  </button>
                  <span className="fl dib pv2 ml3 c-link">
                    <FormattedMessage id="order.printBankInvoice" />
                  </span>
                </a>
              )}
            </section>
          </article>
          <Totals
            totals={totals}
            currencyCode={currencyCode}
            transactions={paymentData.transactions}
          />
        </section>

        <OrderStatus
          status={status}
          packages={packages}
          render={index => (
            <div className="show-on-print">
              <ProgressBarSection
                states={generateProgressBarStates(
                  progressBarStates,
                  index,
                  packages
                )}
                currentState={index}
                hasFinished={OrderUtils.isOrderDelivered(order)}
              />
            </div>
          )}
        />

        {packages.map((deliveryPackage, index) => {
          const shippingEstimate =
            deliveryPackage.deliveryWindow || estimateShipping(deliveryPackage)

          const isPickup = deliveryPackage.deliveryChannel === 'pickup-in-point'

          return (
            <div
              className="w-100 pv7 fl show-on-print"
              key={`${deliveryPackage.selectedSla}_${index}`}
            >
              <div className="flex flex-column">
                <div
                  className={`mw-100 ${cssHandles.marginRight} myo-margin-right`}
                >
                  <h2 className="f4 mb0 lh-copy">
                    <FormattedMessage id="order.package.heading" />
                    {packages.length > 1 && (
                      <span>
                        {` ${index + 1} `}
                        <FormattedMessage id="order.package.numbering" />{' '}
                        {packages.length}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="flex flex-column flex-row-l">
                  <div>
                    {shippingEstimate && (
                      <span className="mr3">
                        {shippingEstimate.startDateUtc ? (
                          <span>
                            {this.props.intl.formatMessage(
                              {
                                id: `order.shippingEstimate${
                                  isPickup ? '.pickup' : ''
                                }.window`,
                              },
                              {
                                date: this.props.intl.formatDate(
                                  shippingEstimate.startDateUtc,
                                  {
                                    // IMPORTANT: if the selected shipping option has a delivery window,
                                    // the time MUST be displayed with UTC.
                                    day: '2-digit',
                                    month: 'long',
                                    timeZone: 'UTC',
                                    weekday: 'long',
                                  }
                                ),
                                startHour: this.props.intl.formatTime(
                                  shippingEstimate.startDateUtc,
                                  // IMPORTANT: if the selected shipping option has a delivery window,
                                  // the time MUST be displayed with UTC.
                                  { timeZone: 'UTC' }
                                ),
                                endHour: this.props.intl.formatTime(
                                  shippingEstimate.endDateUtc,
                                  // IMPORTANT: if the selected shipping option has a delivery window,
                                  // the time MUST be displayed with UTC.
                                  { timeZone: 'UTC' }
                                ),
                              }
                            )}
                          </span>
                        ) : (
                          shippingEstimate.label ||
                          (shippingEstimate.isEstimateInHoursOrMinutes ? (
                            <span className="ib">
                              {this.props.intl.formatMessage(
                                {
                                  id: `order.shippingEstimate${
                                    isPickup ? '.pickup' : ''
                                  }.withTime`,
                                },
                                {
                                  date: this.props.intl.formatDate(
                                    shippingEstimate.date,
                                    // IMPORTANT: shippingEstimateDate should be displayed with the
                                    // the current browser timezone. NOT UTC!
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: '2-digit',
                                    }
                                  ),
                                  // IMPORTANT: shippingEstimateDate should be displayed with the
                                  // the current browser timezone. NOT UTC!
                                  hour: this.props.intl.formatTime(
                                    shippingEstimate.date
                                  ),
                                }
                              )}
                            </span>
                          ) : (
                            this.props.intl.formatMessage(
                              {
                                id: `order.shippingEstimate${
                                  isPickup ? '.pickup' : ''
                                }.noTime`,
                              },
                              {
                                date: this.props.intl.formatDate(
                                  shippingEstimate.date,
                                  {
                                    timeZone: 'UTC',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                  }
                                ),
                              }
                            )
                          ))
                        )}
                      </span>
                    )}
                    <span className="dib br2 pv2 mt2 ph3 f7 f6-xl fw5 nowrap bg-muted-1 c-on-muted-1">
                      {getDeliveryName(deliveryPackage)}
                    </span>
                  </div>
                  <div className="w-40-l w-40-xl w-100-m w-100-s pl6-l">
                    <PackageStatus
                      status={status}
                      pack={deliveryPackage.package || {}}
                      packages={packages}
                      render={i => (
                        <PackageProgressBarSection
                          states={generatePackageProgressBarStates(
                            packageProgressBarStates,
                            i,
                            deliveryPackage.package
                          )}
                          currentState={i}
                        />
                      )}
                    />
                  </div>
                </div>

                {deliveryPackage.package &&
                  deliveryPackage.package.courierStatus && (
                    <TrackingProgress
                      courierStatus={deliveryPackage.package.courierStatus}
                    />
                  )}

                {deliveryPackage.package &&
                  deliveryPackage.package.trackingNumber && (
                    <TrackingDataSpoiler
                      trackingUrl={deliveryPackage.package.trackingUrl}
                      trackingNumber={deliveryPackage.package.trackingNumber}
                    />
                  )}

                {deliveryPackage.package &&
                  deliveryPackage.package.invoiceUrl && (
                    <InvoiceDataSpoiler
                      invoiceUrl={deliveryPackage.package.invoiceUrl}
                    />
                  )}
              </div>
              <Products
                items={deliveryPackage.items}
                currencyCode={currencyCode}
                sellers={sellers}
              />
              {(hasProductChanges || hasReplacement) && (
                <div className="w-100 mv7 fl">
                  <h2 className="f4 ttu">
                    <FormattedMessage id="order.history" />
                  </h2>
                  {hasProductChanges && (
                    <ChangesHistory
                      changes={changesAttachment.changesData}
                      items={items}
                      totals={totals}
                      currencyCode={currencyCode}
                      creationDate={creationDate}
                    />
                  )}
                  {hasReplacement && (
                    <ReplacementHistory history={this.props.history} />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

ViewOrder.propTypes = {
  history: PropTypes.array,
  match: ReactRouterPropTypes.match.isRequired,
  order: PropTypes.object,
  orderError: PropTypes.object,
  fetchOrder: PropTypes.func.isRequired,
  fetchOrders: PropTypes.func.isRequired,
  fetchParentOrders: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  intl: intlShape,
  cssHandles: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  order: OrderUtils.mapOrder(
    state.myOrders.detailedOrders[ownProps.match.params.orderId]
  ),
  orderError: state.myOrders.orderError,
  history: OrderUtils.getReplacementHistory(
    state.myOrders.detailedOrders[ownProps.match.params.orderId],
    state.myOrders.parentOrders
  ),
  isLoading: state.myOrders.isLoading,
  cssHandles: PropTypes.object,
})

const enhance = compose(
  connect(mapStateToProps, {
    fetchOrder,
    fetchParentOrders,
    fetchOrders,
  }),
  withCssHandles(CSS_HANDLES),
  injectIntl
)

export default enhance(ViewOrder)

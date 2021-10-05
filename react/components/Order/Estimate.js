import { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { utils } from 'vtex.my-account-commons'

const { estimateShipping } = utils

class Estimate extends Component {
  render() {
    const shippingEstimate = estimateShipping({
      shippingEstimate: this.props.shippingEstimate,
      shippingEstimateDate: this.props.shippingEstimateDate,
    })

    if (!shippingEstimate) {
      return null
    }

    return (
      (shippingEstimate && shippingEstimate.label) ||
      (shippingEstimate.isEstimateInHoursOrMinutes
        ? this.props.intl.formatMessage(
            {
              id: 'order.shippingEstimate.withTime',
            },
            {
              // IMPORTANT: shippingEstimateDate should be displayed with the
              // the current browser timezone. NOT UTC!
              date: this.props.intl.formatDate(shippingEstimate.date),
              hour: this.props.intl.formatTime(shippingEstimate.date),
            }
          )
        : this.props.intl.formatMessage(
            { id: 'order.shippingEstimate.noTime' },
            {
              date: this.props.intl.formatDate(shippingEstimate.date, {
                timeZone: 'UTC',
              }),
            }
          ))
    )
  }
}

Estimate.propTypes = {
  intl: intlShape,
  shippingEstimate: PropTypes.string,
  shippingEstimateDate: PropTypes.string,
}

export default injectIntl(Estimate)

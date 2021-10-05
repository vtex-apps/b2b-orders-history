import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const TrackingDataSpoiler = ({ trackingUrl, trackingNumber }) => {
  return (
    <div>
      {trackingUrl && (
        <a
          className="f6 link no-underline c-link hover-c-link"
          target="_blank"
          rel="noopener noreferrer"
          href={
            trackingUrl.trim().indexOf('http') === 0
              ? trackingUrl
              : `https://${trackingUrl}`
          }
        >
          <FormattedMessage id="order.trackingData.clickHereToGoToExternalPage" />
        </a>
      )}
      {trackingNumber && (
        <p>
          <FormattedMessage
            id="order.trackingData.shipping"
            values={{ trackingNumber }}
          />
        </p>
      )}
    </div>
  )
}

TrackingDataSpoiler.propTypes = {
  trackingUrl: PropTypes.string,
  trackingNumber: PropTypes.string,
}

export default TrackingDataSpoiler

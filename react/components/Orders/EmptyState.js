import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { EmptyState } from 'vtex.styleguide'

const EmptyOrders = ({ ongoing, finished, intl }) => {
  let messageId = 'orders.notFound'

  if (finished) {
    messageId = 'orders.finishedNotFound'
  } else if (ongoing) {
    messageId = 'orders.ongoingNotFound'
  }

  return (
    <EmptyState
      title={
        <span className="c-on-base">
          {intl.formatMessage({ id: messageId })}
        </span>
      }
    />
  )
}

EmptyOrders.propTypes = {
  ongoing: PropTypes.bool,
  finished: PropTypes.bool,
  intl: intlShape.isRequired,
}

export default injectIntl(EmptyOrders)

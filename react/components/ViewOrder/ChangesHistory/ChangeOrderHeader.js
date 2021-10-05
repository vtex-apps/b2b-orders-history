import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import FinalPrice from '../../commons/FinalPrice'

const ChangeOrderHeader = ({
  title,
  date,
  totals,
  currencyCode,
  intl: { formatDate, formatTime },
}) => (
  <div className="w-100">
    <div className="t-heading-4 mb3">{title}</div>
    <div className="t-small c-muted-1">
      <FormattedMessage
        id="order.change.date"
        values={{
          date: formatDate(date, {
            timeZone: 'UTC',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }),
          hour: formatTime(date, {
            timeZone: 'UTC',
          }),
        }}
      />
    </div>
    <div className="t-body c-on-base mt5">
      <FinalPrice totals={totals} currencyCode={currencyCode} />
    </div>
  </div>
)

ChangeOrderHeader.propTypes = {
  title: PropTypes.element.isRequired,
  totals: PropTypes.arrayOf(PropTypes.object).isRequired,
  currencyCode: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(ChangeOrderHeader)

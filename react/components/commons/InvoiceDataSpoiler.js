import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

const InvoiceDataSpoiler = ({ invoiceUrl, intl }) => {
  return (
    <div className="pt1">
      <a
        className="f6 link no-underline c-link"
        target="_blank"
        rel="noopener noreferrer"
        href={
          invoiceUrl.trim().indexOf('http') === 0
            ? invoiceUrl
            : `http://${invoiceUrl}`
        }
      >
        {intl.formatMessage({ id: 'order.seeInvoice' })}
      </a>
    </div>
  )
}

InvoiceDataSpoiler.propTypes = {
  invoiceUrl: PropTypes.string,
  intl: intlShape.isRequired,
}

export default injectIntl(InvoiceDataSpoiler)

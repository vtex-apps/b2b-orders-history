import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'

const ExtensionLinks = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage({ id: 'orders.title' }),
      path: '/orders-history',
    },
  ])
}

ExtensionLinks.propTypes = {
  render: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
}

export default injectIntl(ExtensionLinks)

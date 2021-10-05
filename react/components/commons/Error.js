import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { intlShape, injectIntl } from 'react-intl'

class Error extends Component {
  getI18nStr = id => this.props.intl.formatMessage({ id })

  render() {
    const { error } = this.props
    const status = error && error.status

    return (
      <div className="tc pt5 mw6 center">
        <div className="pa5 br2 bg-danger--faded">
          <div>
            <span className="ml3">
              {error && status === 401
                ? this.getI18nStr('global.loginNeeded')
                : error && status === 403
                ? this.getI18nStr('global.unauthorized')
                : error && status === 404
                ? this.getI18nStr('global.notFound')
                : this.getI18nStr('global.unknownError')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Error.propTypes = {
  error: PropTypes.object,
  intl: intlShape.isRequired,
}

export default injectIntl(Error)

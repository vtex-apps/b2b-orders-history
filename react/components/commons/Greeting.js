/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import LocationUtils from '../../utils/LocationUtils'

class Greeting extends React.Component {
  state = {
    isActive:
      window &&
      window.location &&
      window.location.search.indexOf(this.props.param) !== -1,
  }

  handleDismiss = () => {
    window.location.search = ''

    this.setState({
      isActive: false,
    })
  }

  getVariationStyle(variation) {
    const style = 'f5 ph7 pv5 br3 pointer mb5'

    switch (variation) {
      case 'success':
        return `${style} c-on-sucess--faded bg-success--faded`
      case 'error':
        return `${style} bg-danger--faded c-on-danger--faded`
      case 'alert':
        return `${style} bg-warning--faded c-on-warning--faded`
      case 'primary':
        return `${style} bg-base--inverted c-on-base--inverted`
      default:
        return `${style} bg-base--inverted c-on-base--inverted`
    }
  }

  render() {
    const { isActive } = this.state
    const { param, variation, greetingId } = this.props

    if (!isActive) {
      return null
    }

    const paramValue = LocationUtils.getSearchParam(param)
    const style = this.getVariationStyle(variation)

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div className={style} onClick={this.handleDismiss}>
        <FormattedMessage id={greetingId} values={{ value: paramValue }} />
        <svg
          className="fr hh1 w1 pt2"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Fechar</title>
          <path
            fill="rgba(0, 0, 0, 0.3)"
            d="M0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10C4.478 0 0 4.478 0 10zm13.702 2.246c.397.398.397 1.044 0 1.442-.413.41-1.058.41-1.456.014l-2.164-2.164c-.046-.046-.12-.046-.164 0l-2.164 2.164c-.398.397-1.043.397-1.44 0-.413-.413-.413-1.058-.015-1.456l2.16-2.164c.044-.045.044-.12 0-.163L6.3 7.75c-.4-.398-.4-1.043 0-1.44.412-.413 1.057-.413 1.454-.016L9.918 8.46c.045.046.118.046.164 0l2.164-2.164c.398-.397 1.044-.397 1.442.002.41.41.41 1.055.014 1.453l-2.164 2.17c-.045.044-.045.118 0 .163l2.164 2.164z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    )
  }
}

Greeting.propTypes = {
  param: PropTypes.string.isRequired,
  variation: PropTypes.string,
  greetingId: PropTypes.string.isRequired,
}

export default Greeting

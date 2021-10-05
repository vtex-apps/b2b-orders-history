import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const StatusColor = ({ state, status }) => {
  let styles

  const orderState = state || 'unknown'

  switch (status) {
    case 'normal':
      styles = ' bg-muted-1 c-on-muted-1 '
      break
    case 'cancelled':
      styles = ' bg-danger c-on-danger '
      break
    case 'pending':
      styles = ' bg-warning c-on-warning '
      break
    case 'disabled':
      styles = ' bg-muted-2 c-on-muted-2 '
      break
    default:
      styles = ' bg-muted-2 c-on-muted-2 '
  }

  return (
    <span className={`dib br2 pv2 ph3 f7 f6-xl nowrap ${styles}`}>
      <FormattedMessage id={`order.state.${orderState}`} />
    </span>
  )
}

StatusColor.propTypes = {
  state: PropTypes.string.isRequired,
  status: PropTypes.string,
}

export default StatusColor

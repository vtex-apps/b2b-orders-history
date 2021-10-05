import React from 'react'
import PropTypes from 'prop-types'
import { FormattedDate } from 'react-intl'

const CustomDate = ({ date, style = '' }) => {
  let settings

  switch (style.toLowerCase()) {
    case 'short':
      settings = {}
      break
    default:
      settings = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
      }
  }

  return <FormattedDate value={date} {...settings} />
}

CustomDate.propTypes = {
  date: PropTypes.any.isRequired,
  style: PropTypes.string,
}

export default CustomDate

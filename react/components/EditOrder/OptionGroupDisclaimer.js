import React from 'react'
import PropTypes from 'prop-types'

const OptionGroupDisclaimer = ({ group: { description } }) => (
  <div>
    <strong className="pt3 db">{description.title}</strong>
    <ul className="pb0 mt3 ml0 mb0 pl5">
      {description.disclaimers.map((disclaimer, i) => (
        <li className="pb3" key={`disclaimer_${i}`}>
          {disclaimer}
        </li>
      ))}
    </ul>
  </div>
)

OptionGroupDisclaimer.propTypes = {
  group: PropTypes.object.isRequired,
}

export default OptionGroupDisclaimer

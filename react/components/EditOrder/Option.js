import React from 'react'
import PropTypes from 'prop-types'
import kebabCase from 'lodash/kebabCase'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['option', 'optionInput']

const Option = ({ id, option, groupName, onChange, disabled }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const handleChange = () => onChange(option, groupName)
  const inputId = kebabCase(id)
  return (
    <li className={`${cssHandles.option} myo-option pv5 bb bw1 b--muted-5`}>
      <span className="dtc v-mid">
        <input
          disabled={disabled}
          type="radio"
          name="sacForm"
          id={inputId}
          value={option.value}
          onChange={handleChange}
          className={`${cssHandles.optionInput} myo-option-input relative input-reset br-100 ba bb bw1 b--muted-3 dib ma0 option`}
          style={{ width: '1.3rem', height: '1.3rem', minHeight: '1.3rem' }}
        />
      </span>
      <label
        className={`w-100 dtc f5 fw4 pl5 lh-copy c-on-base ${
          disabled ? 'cursor-not-allowed o-80' : ''
        }`}
        style={{
          fontSize:
            '1rem' /* Same size as f5 -- used here to override bootstrap */,
        }}
        htmlFor={inputId}
      >
        {option.label.i18n ? (
          <FormattedMessage id={option.label.i18n} />
        ) : (
          option.label
        )}
      </label>
    </li>
  )
}

Option.defaultProps = {
  id: '00',
}

Option.propTypes = {
  id: PropTypes.string,
  option: PropTypes.object.isRequired,
  groupName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export default Option

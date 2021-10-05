import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['font']

const getInnerPath = isOpen =>
  isOpen
    ? 'M73 158.497V123.58h136.078v34.917'
    : 'M123.98 209.078v-50.58H73V123.58h50.98V73h33.986v50.58h51.112v34.917h-51.112v50.58'

const PaymentConnectorResponses = ({ data = {}, isOpen, onClick }) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  return (
    <section>
      <button
        type="button"
        onClick={onClick}
        className={`${
          isOpen ? 'mb5' : ''
        } dt mv3 pl0 bw0 bg-transparent input-reset c-muted-1 lh-solid f7 fw6`}
      >
        <svg
          className="dtr v-mid mr2 h-15px w-15px"
          viewBox="0 0 283 283"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="currentColor" fillRule="evenodd">
            <circle className="c-muted-1" cx="141.5" cy="141.5" r="141.5" />
            <path fill="#FFF" d={getInnerPath(isOpen)} />
          </g>
        </svg>
        <span className={`dtr ${cssHandles.font} myo-font`}>
          <FormattedMessage id={'paymentData.additionalInfo'} />
        </span>
      </button>

      <ul
        className={`${
          isOpen ? 'o-100 max-h-999' : 'o-0 max-h-0'
        } pl0 ma0 transition-opacity-06s transition-max-height-06s list c-muted-1 overflow-y-hidden`}
      >
        {Object.keys(data).map(
          (key, index) =>
            data[key] &&
            data[key].length && (
              <li className={`${isOpen ? 'mb2' : ''} f7`} key={index}>
                <span className="mr3 fw5">{key}:</span>
                <span>{data[key]}</span>
              </li>
            )
        )}
      </ul>
    </section>
  )
}
PaymentConnectorResponses.propTypes = {
  data: PropTypes.object,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
}

export default PaymentConnectorResponses

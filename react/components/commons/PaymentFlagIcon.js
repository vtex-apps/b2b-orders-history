import React from 'react'
import PropTypes from 'prop-types'

import PaymentFlagsSprite from '../../images/payment-flags.png'
import * as g from '../../constants/paymentGroups'

const PaymentFlagIcon = ({ type, size, group, alignFix }) => {
  if (!type) {
    return null
  }

  let slug
  switch (group) {
    case g.BANK_INVOICE:
      slug = 'bankinvoice'
      break
    case g.PAYPAL:
      slug = 'paypal'
      break
    case g.GIFT_CARD:
      slug = 'giftcard'
      break
    case g.DEBIT_CARD:
      slug = 'cash'
      break
    default:
      slug = type.toLowerCase().split(' ')[0]
      break
  }

  const originalSize = 560 /* In pixel */
  const ratio = size ? size / originalSize : originalSize

  const positions = {
    visa: 0,
    mastercard: -40 * ratio,
    diners: -80 * ratio,
    american: -120 * ratio,
    hipercard: -160 * ratio,
    discover: -200 * ratio,
    aura: -280 * ratio,
    banricompras: -240 * ratio,
    elo: -320 * ratio,
    jcb: -360 * ratio,
    bankinvoice: -400 * ratio,
    paypal: -440 * ratio,
    giftcard: -480 * ratio,
    cash: -520 * ratio,
  }

  const position =
    positions[slug] || positions[slug] === 0 ? positions[slug] : -1

  if (position === -1) {
    return null
  }

  return (
    <span
      className={`fl dib overflow-hidden mr3 w-29px h-22px ${
        alignFix ? 'mt2' : ''
      }`}
    >
      <img
        alt={type}
        src={PaymentFlagsSprite}
        style={{ maxWidth: `${size}px`, marginLeft: position }}
      />
    </span>
  )
}

PaymentFlagIcon.defaultProps = {
  alignFix: false,
}

PaymentFlagIcon.propTypes = {
  alignFix: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.number,
  group: PropTypes.string,
}

export default PaymentFlagIcon

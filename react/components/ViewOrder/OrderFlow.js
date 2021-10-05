import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import checkIcon from '../../images/check.svg'

const OrderFlow = ({ step }) => {
  const status = [
    'order.stepsFlow.placed', // 'Pedido Realizado',
    'order.stepsFlow.approved', // 'Pedido Aprovado',
    'order.stepsFlow.sent', // 'Pedido Enviado',
    'order.stepsFlow.shipping', // 'Pedido à caminho',
    'order.stepsFlow.finished', // 'Pedido Concluído',
  ]

  /* if (!pos) {
    return (
      <p className="dn">
        <FormattedMessage id="order.stepsFlow.cancelled" />
      </p>
    )
  } */

  return (
    <ul className="list overflow-hidden ma0">
      {status.map((label, index) => {
        const activeOpacity = index >= step ? 'o-40' : ''
        const activeStyle = index >= step ? 'ba b--muted-5 br-100' : ''
        const activeImg =
          index >= step ? '' : <img src={checkIcon} alt="check" />

        return (
          <li
            className={`fl w-20-ns w-100 mb7 mb0-ns fw6 lh-copy ${activeOpacity}`}
            key={index}
          >
            <span
              className={`mr3 fl db ${activeStyle}`}
              style={{ width: '25px', height: '25px' }}
            >
              {activeImg}
            </span>
            <FormattedMessage id={label} />
          </li>
        )
      })}
    </ul>
  )
}

OrderFlow.propTypes = {
  step: PropTypes.number,
}

export default OrderFlow

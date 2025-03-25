import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'vtex.my-account-commons/Router'

import iconOptions from '../../images/options.svg'
import DropdownButton from './Dropdown'
import { addBaseURL } from '../../utils'
import { getCustomerEmail } from '../../actions/utils'

const OrderActions = ({ order, allowSAC }) => {
  const {
    orderId,
    orderGroup,
    allowEdition,
    allowCancellation,
    clientProfileData: { email: clientEmail },
  } = order

  const [loggedInEmail, setLoggedInEmail] = useState('')

  const handleOrderAgainClick = () => {
    return window.open(
      addBaseURL(`/checkout/orderform/createBy/${orderGroup}`),
      '_self'
    )
  }

  const fetchLoggedInEmail = async () => {
    return getCustomerEmail()
  }

  useEffect(() => {
    fetchLoggedInEmail()
      .then(email => {
        setLoggedInEmail(email)
      })
      .catch(error => console.error(error))

    return () => {
      setLoggedInEmail('')
    }
  }, [setLoggedInEmail])

  const isOwner = clientEmail === loggedInEmail
  const showEditOrderButton = allowSAC && allowEdition && isOwner
  const showCancelOrderButton = allowCancellation

  const CancelOrderButton = showCancelOrderButton ? (
    <Link className="no-underline" to={`/orders-history/${orderId}/cancel`}>
      <span className="db pv2 c-link hover-c-link link">
        <FormattedMessage id="order.cancelOrder" />
      </span>
    </Link>
  ) : null

  const PrintOrderButton = (
    <button
      onClick={() => window.print()}
      className="no-underline"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 'none'
      }}
    >
      <span className="db pv2 c-link hover-c-link link" style={{ cursor: 'pointer', textAlign: 'left' }}>
        Print Order
      </span>
    </button>
  )

  const EditOrderButton = showEditOrderButton ? (
    <Link className="no-underline" to={`/orders-history/${orderId}/edit`}>
      <span className="db pv2 c-link hover-c-link link">
        <FormattedMessage id="order.changeOrder" />
      </span>
    </Link>
  ) : null

  const OrderAgainButton = (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      // eslint-disable-next-line no-script-url
      href="javascript:void(0)"
      onClick={handleOrderAgainClick}
      className="f6 link underline c-link hover-c-link relative"
    >
      <svg
        className="hh1 w1 absolute top-0"
        fill="#134CD8"
        viewBox="0 0 14 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.01 1.467V.32c0-.263-.304-.414-.515-.255L2.98 2.71c-.32.238-.32.714-.002.954l3.516 2.654c.212.16.515.01.515-.256V5.006c0-.375.34-.656.71-.6 2.56.395 4.44 2.862 3.85 5.632-.37 1.756-1.793 3.174-3.554 3.544-3.03.638-5.704-1.65-5.704-4.562 0-.955.293-1.84.79-2.575.346-.513.21-1.208-.298-1.563l-.02-.014c-.516-.36-1.246-.255-1.598.265C.196 6.607-.258 8.48.146 10.466c.548 2.705 2.74 4.877 5.46 5.4C10.084 16.726 14 13.33 14 9.02c0-3.658-2.822-6.658-6.414-6.955-.322-.027-.577-.277-.577-.598"
          fillRule="evenodd"
        />
      </svg>

      <span className="dib" style={{ marginLeft: '20px' }}>
        <FormattedMessage id="order.orderAgain" />
      </span>
    </a>
  )

  const availableOptions = [CancelOrderButton, EditOrderButton, PrintOrderButton].filter(
    option => option !== null
  )
  const options =
    availableOptions.length > 1 ? (
      <DropdownButton icon={iconOptions} label="order.moreOptions">
        {EditOrderButton}
        {CancelOrderButton}
        {PrintOrderButton}
      </DropdownButton>
    ) : (
      availableOptions[0]
    )

  return (
    <ul className="list tl tr-ns ma0 pa0-s">
      {isOwner && (
        <li className="db dib-ns mr7-ns mb5 mb0-ns">{OrderAgainButton}</li>
      )}
      <li className="db dib-ns mb5 mb0-ns">{options}</li>
    </ul>
  )
}

OrderActions.propTypes = {
  order: PropTypes.object.isRequired,
  allowSAC: PropTypes.bool,
}

export default OrderActions

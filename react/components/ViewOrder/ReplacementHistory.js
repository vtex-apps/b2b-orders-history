import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'vtex.my-account-commons/Router'

import StatusColor from '../commons/StatusColor'
import FormattedDate from '../commons/FormattedDate'

const ReplacementHistory = ({ history }) => (
  <table className="table w-100">
    <tbody>
      {history.map((order, index) => (
        <tr
          className={`${order.isCurrent ? 'bg-muted-5' : 'bg-base'}`}
          key={index}
        >
          <td className="pa2 w-25 pb3 tl v-mid">
            <FormattedDate date={order.creationDate} />
          </td>
          <td className="pa0 w-35 pb3 tl mid">
            {order.commercialConditionData && (
              <strong>
                <FormattedMessage
                  id={`reasons.${order.commercialConditionData.reason}`}
                />
              </strong>
            )}
          </td>
          <td className="pa0 w-20 pb3 tc v-mid">
            <StatusColor state={order.status} status={order.stateStatus} />
          </td>
          <td className="pa0 w-20 pb3 tr v-mid">
            {!order.isCurrent && (
              <Link to={`/orders-history/${order.orderId}`}>
                <FormattedMessage id="seeOrder" />
              </Link>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

ReplacementHistory.propTypes = {
  history: PropTypes.array.isRequired,
}

export default ReplacementHistory

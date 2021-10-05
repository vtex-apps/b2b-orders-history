import React from 'react'
import { FormattedMessage } from 'react-intl'
import packagify from '@vtex/delivery-packages'
import { ProgressBarBundle } from 'vtex.my-account-commons'

import { OrderUtils } from '../../utils'
import { OrderShape } from '../../types'

const StatusBadge = ({ order }) => {
  let orderState = 'unknown'
  const orderRawStatusPrefix = 'order.state.'
  const isPickup = OrderUtils.isOrderPickUp(order)
  // The order object shape may vary depending on where StatusBadge is called.
  // If it's called from the listing page, the isOrderDelivered function won't work properly.
  // So, we need to rely on the isAllDelivered property.
  const wasDelivered =
    OrderUtils.isOrderDelivered(order) || order.isAllDelivered
  const isReadyToPickup =
    OrderUtils.isOrderPickUp(order) && OrderUtils.isOrderReadyToPickUp(order)
  const {
    utils: { getCurrentProgressBarState },
  } = ProgressBarBundle

  const packages = order.packageAttachment != null ? packagify(order) : null
  const currentProgressBarState = getCurrentProgressBarState(
    order.status,
    packages
  )
  const { status: normalizedStatus } = OrderUtils.getFullState(order.status)

  if (order.status) {
    orderState =
      currentProgressBarState || `${orderRawStatusPrefix}${order.status}`
    if (
      isPickup &&
      [
        'window-to-cancel',
        'approve-payment',
        'ready-for-handling',
        'handling',
        'release-to-fulfillment',
      ].includes(order.status)
    ) {
      orderState = `${orderRawStatusPrefix}handlingPickup`
    } else if (normalizedStatus === 'success') {
      if (isPickup) {
        if (wasDelivered) {
          orderState = `${orderRawStatusPrefix}pickedUp`
        } else if (isReadyToPickup) {
          orderState = `${orderRawStatusPrefix}ready-for-pickup`
        } else {
          orderState = `${orderRawStatusPrefix}handlingPickup`
        }
      } else if (wasDelivered) {
        orderState = `${orderRawStatusPrefix}delivered`
      }
    }
  }

  let styles
  let textStyle

  switch (normalizedStatus) {
    case 'normal':
      styles = 'bg-muted-1'
      textStyle = 'c-on-muted-1'
      break

    case 'cancelled':
      styles = 'bg-danger'
      textStyle = 'c-on-danger'
      break

    case 'pending':
      styles = 'bg-warning'
      break

    case 'disabled':
      styles = 'bg-muted-2'
      textStyle = 'c-on-muted-2'
      break

    case 'success':
      styles = 'bg-success'
      textStyle = 'c-on-success'
      break

    default:
      styles = 'bg-muted-2'
      textStyle = 'c-on-muted-2'
  }

  return (
    <div className={`dib br2 pv2 ph3 f7 fw5 tc ${styles}`}>
      <span className={textStyle || 'c-on-base'}>
        <FormattedMessage id={orderState} />
      </span>
    </div>
  )
}

StatusBadge.propTypes = {
  order: OrderShape,
}

export default StatusBadge

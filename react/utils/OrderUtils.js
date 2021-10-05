import packagify from '@vtex/delivery-packages'

class OrderUtils {
  static getReplacementHistory(order, parentOrders) {
    const current = { ...order, isCurrent: true }
    if (!parentOrders.length) {
      return []
    }
    return [current, ...parentOrders].sort(
      (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    )
  }

  static mapOrder(order) {
    if (order) {
      const orderFullStateData = this.getFullState(order.status)

      order.stateLabel = orderFullStateData.label
      order.stateStatus = orderFullStateData.status
      order.stateStep = orderFullStateData.step

      order.items = order.items.map((item, index) => {
        item.sellerName = order.sellers.find(
          seller => seller.id === item.seller
        ).name

        item.logisticsInfo = order.shippingData.logisticsInfo.find(
          log => log.itemIndex === index
        )
        const { shippingEstimate, shippingEstimateDate } = item.logisticsInfo

        item = {
          ...item,
          shippingEstimate,
          shippingEstimateDate,
        }

        return item
      })
      return order
    }
  }

  static isOrderActive(state) {
    return !['replace', 'replaced', 'cancel', 'canceled'].includes(state)
  }

  static getBankInvoiceUrl(transactions) {
    for (const transaction of transactions) {
      for (const payment of transaction.payments) {
        if (payment.url) {
          return payment.url.replace('{Installment}', '1')
        }
      }
    }
    return null
  }

  static isOrderFinished(state) {
    return ![
      'payment-pending',
      'payment-approved',
      'handling',
      'ready-for-handling',
      'request-cancel',
      'window-to-cancel',
      'waiting-for-seller-confirmation',
      'waiting-for-seller-decision',
      'request-cancel',
      'ship',
      'cancel',
      'invoice',
      'cancellation-requested',
    ].includes(state)
  }

  static getFullState(state) {
    switch (state) {
      // some orders doesn't have a status yet and returns empty
      case '':
      case 'waiting-for-seller-confirmation':
      case 'order-created':
      case 'order-completed':
      case 'on-order-completed':
        return {
          label: 'Processando',
          status: 'pending',
          step: 0 /* UI-only, renders order current step in OrderFlow of ViewOrder page */,
        }
      case 'payment-pending':
        return {
          label: 'Processando Pagamento',
          status: 'pending',
          step: 1,
        }
      case 'window-to-cancel':
      case 'approve-payment':
        return {
          label: 'Carência para cancelamento',
          status: 'pending',
          step: 2,
        }
      case 'payment-approved':
        return {
          label: 'Pagamento Aprovado',
          status: 'normal',
          step: 2,
        }
      case 'request-cancel':
        return {
          label: 'Cancelado solicitado',
          status: 'pending',
          step: 2,
        }
      case 'cancel':
        return {
          label: 'Processando Cancelamento',
          status: 'pending',
          step: 2,
        }
      case 'canceled':
        return {
          label: 'Cancelado',
          status: 'cancelled',
          step: null,
        }
      case 'waiting-for-seller-decision':
        return {
          label: 'Cancelamento solicitado',
          status: 'pending',
          step: 2,
        }
      case 'invoice':
        return {
          label: 'Enviando',
          status: 'normal',
          step: 4,
        }
      case 'invoiced':
        return {
          label: 'Enviado',
          status: 'success',
          step: 5,
        }
      case 'replaced':
        return {
          label: 'Substituído',
          status: 'disabled',
          step: null,
        }
      default:
        return {
          label: state,
          status: 'normal',
          step: 0,
        }
    }
  }

  /**
   * Check if all packages of an order are delivered.
   * Based on  https://github.com/vtex-apps/my-account-commons/blob/master/react/components/ProgressBar/getOrderProgress.ts#L46
   * */
  static isOrderDelivered(order) {
    if (order.items == null) return false

    const packages = packagify(order)
    if (packages == null || packages.length === 0) return false

    return packages.every(item => {
      const { package: pkg } = item
      if (pkg == null || pkg.courierStatus == null) return false

      const { courierStatus } = pkg
      const isCourierFinished = courierStatus.finished === true

      return isCourierFinished
    })
  }

  static isOrderReadyToPickUp(order) {
    if (order.items == null) return false

    const packages = packagify(order)
    if (packages == null || packages.length === 0) return false

    return packages.every(item => {
      const isPickUp = item.deliveryChannel === 'pickup-in-point'
      const isReadyToPickUp =
        !item.shippingEstimateDate ||
        Date.now() >= new Date(item.shippingEstimateDate)
      return isPickUp && isReadyToPickUp
    })
  }

  static isOrderPickUp(order) {
    if (order.items == null) return false

    const packages = packagify(order)
    if (packages == null || packages.length === 0) return false

    return packages.every(item => item.deliveryChannel === 'pickup-in-point')
  }
}

export default OrderUtils

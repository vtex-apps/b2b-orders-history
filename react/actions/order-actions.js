import keyBy from 'lodash/keyBy'
import Promise from 'bluebird'
import { v4 as getGUID } from 'uuid'

import { skuReplacementEnabled } from '../utils/replacementUtils'
import { getReasons } from '../services/MasterData'
import {
  RECEIVE_ORDERS,
  RECEIVE_ORDERS_ERROR,
  REQUEST_ORDERS,
  RECEIVE_ORDER,
  REQUEST_REPLACEMENT_OPTIONS,
  REQUEST_CANCELLATION_OPTIONS,
  RECEIVE_ORDER_ERROR,
  RECEIVE_PARENT_ORDERS,
  RECEIVE_REPLACEMENT_OPTIONS,
  RECEIVE_CANCELLATION_OPTIONS,
  REDIRECT_PAGE,
  RECEIVE_MORE_ORDERS,
  RECEIVE_CANCELLATION_REASONS_ERROR,
  RECEIVE_REPLACEMENT_REASONS_ERROR,
  REQUEST_ORDER_CANCELLATION,
  RECEIVE_ORDER_CANCELLATION_ERROR,
} from './types'
import {
  parseJSON,
  checkStatus,
  checkB2B,
  getOrdersURL,
  getOrderDetailURL,
  OPERATION_ID_HEADER,
  getResponseOperationId,
} from './utils'
import { addBaseURL } from '../utils'

const BASE_URL = addBaseURL('/api/oms/user/orders/')
const ORDERS_DETAILED_LOADED_LIMIT = 3

let listingResponseGuid = ''

async function loadOrders({ page, guid }) {
  const headers = {
    [OPERATION_ID_HEADER]: guid,
    'x-vtex-user-agent': process.env.VTEX_APP_ID,
  }

  return fetch(await getOrdersURL(BASE_URL, page ?? '1'), {
    credentials: 'same-origin',
    headers,
  })
    .then(checkStatus)
    .then(response => {
      listingResponseGuid = getResponseOperationId(response)

      return response
    })
    .then(parseJSON)
}

async function loadOrder(orderId, listingGuid) {
  const guid = getGUID()
  const headers = {
    [OPERATION_ID_HEADER]: guid,
    'x-vtex-user-agent': process.env.VTEX_APP_ID,
  }

  let detailResponseGuid = ''

  return fetch(await getOrderDetailURL(BASE_URL + orderId), {
    credentials: 'same-origin',
    headers,
  })
    .then(checkStatus)
    .then(response => {
      detailResponseGuid = getResponseOperationId(response)

      return response
    })
    .then(parseJSON)
}

export function goToHomePageAndReload(queryString, anchor) {
  queryString = queryString ? `?${queryString}` : ''
  anchor = anchor ? `#${anchor}` : ''

  window.location.href = `${window.location.pathname}${queryString}${anchor}`
}

export function goToOrdersHomePageWithCanceledOrder(orderId) {
  const queryString = `canceledOrder=${orderId}`
  const anchor = '/orders-history'

  goToHomePageAndReload(queryString, anchor)
}

export const requestOrders = () => ({
  type: REQUEST_ORDERS,
})

export const requestReplacementOptions = () => ({
  type: REQUEST_REPLACEMENT_OPTIONS,
})

export const requestCancellationOptions = () => ({
  type: REQUEST_CANCELLATION_OPTIONS,
})

export const redirectPage = () => ({
  type: REDIRECT_PAGE,
})

export const receiveOrders = (
  basicOrders,
  userOrders,
  detailedOrders,
  currentPage,
  pages
) => ({
  type: RECEIVE_ORDERS,
  basicOrders,
  userOrders,
  detailedOrders,
  currentPage,
  pages,
})

export const receiveMoreOrders = (
  basicOrders,
  userOrders,
  currentPage,
  pages
) => ({
  type: RECEIVE_MORE_ORDERS,
  basicOrders,
  userOrders,
  currentPage,
  pages,
})

export const receiveOrder = order => ({
  type: RECEIVE_ORDER,
  order,
})

export const receiveReplacementOptions = availableOptions => ({
  type: RECEIVE_REPLACEMENT_OPTIONS,
  availableOptions,
})

export const receiveCancellationOptions = availableOptions => ({
  type: RECEIVE_CANCELLATION_OPTIONS,
  availableOptions,
})

export const receiveParentOrders = parentOrders => ({
  type: RECEIVE_PARENT_ORDERS,
  parentOrders,
})

export const receiveOrdersError = error => ({
  type: RECEIVE_ORDERS_ERROR,
  error,
})

export const receiveCancellationReasonsError = error => ({
  type: RECEIVE_CANCELLATION_REASONS_ERROR,
  error,
})

export const requestOrderCancellation = () => ({
  type: REQUEST_ORDER_CANCELLATION,
})

export const receiveOrderCancellationError = error => ({
  type: RECEIVE_ORDER_CANCELLATION_ERROR,
  error,
})

export const receiveReplacementReasonsError = error => ({
  type: RECEIVE_REPLACEMENT_REASONS_ERROR,
  error,
})

export const receiveOrderError = error => ({
  type: RECEIVE_ORDER_ERROR,
  error,
})

export const fetchMoreOrders = page => dispatch => {
  const guid = getGUID()

  return loadOrders({ page, guid })
    .then(response => {
      const orders = response.list

      const { userOrders } = orders.reduce(
        (totalOrders, order) => {
          totalOrders.userOrders = [...totalOrders.userOrders, order.orderId]

          return totalOrders
        },
        { userOrders: [] }
      )

      dispatch(
        receiveMoreOrders(
          keyBy(orders, 'orderId'),
          userOrders,
          response.paging.currentPage,
          response.paging.pages
        )
      )
    })
    .catch(error => dispatch(receiveOrdersError(error)))
}

export const fetchOrders = () => dispatch => {
  dispatch(requestOrders())

  const listGuid = getGUID()

  return loadOrders({ guid: listGuid })
    .then(response => {
      const orders = response.list
      const { userOrders, ordersToBeLoaded } = orders.reduce(
        (totalOrders, order) => {
          if (
            !order.status ||
            totalOrders.ordersToBeLoaded.length < ORDERS_DETAILED_LOADED_LIMIT
          ) {
            totalOrders.ordersToBeLoaded = [
              ...totalOrders.ordersToBeLoaded,
              order.orderId,
            ]
          }

          totalOrders.userOrders = [...totalOrders.userOrders, order.orderId]

          return totalOrders
        },
        { ordersToBeLoaded: [], userOrders: [] }
      )

      return Promise.map(ordersToBeLoaded, id => loadOrder(id, listGuid)).then(
        ordersDetailedList => {
          dispatch(
            receiveOrders(
              keyBy(orders, 'orderId'),
              userOrders,
              keyBy(ordersDetailedList, 'orderId'),
              response.paging.currentPage,
              response.paging.pages
            )
          )
        }
      )
    })
    .catch(error => dispatch(receiveOrdersError(error)))
}

export const fetchParentOrders = (order, orders) => dispatch => {
  if (
    order.commercialConditionData &&
    order.commercialConditionData.parentOrderId
  ) {
    return loadOrder(order.commercialConditionData.parentOrderId)
      .then(orderFetched => {
        return dispatch(
          fetchParentOrders(orderFetched, [...orders, orderFetched])
        )
      })
      .catch(error => dispatch(receiveOrderError(error)))
  }

  dispatch(receiveParentOrders(orders))

  return Promise.resolve()
}

export const fetchOrder = (orderId, fetchParents = false) => dispatch => {
  return loadOrder(orderId)
    .then(order => {
      dispatch(receiveOrder(order))
      if (!fetchParents) return
      dispatch(fetchParentOrders(order, []))

      return null
    })
    .catch(error => dispatch(receiveOrderError(error)))
}

export const getReplacementReasons = (locale, order) => dispatch => {
  dispatch(requestReplacementOptions())

  return getReasons('replacement', locale)
    .then(options => {
      if (!options || !options.groups || !options.groups.length) {
        dispatch(receiveReplacementOptions([]))
      }

      return skuReplacementEnabled(order).then(isSkuReplaceable => {
        const groups = options.groups.map(group => {
          if (!isSkuReplaceable && group.id === 'sku') {
            return { ...group, enabled: false }
          }

          return { ...group, enabled: true }
        })

        const availableOptions = {
          ...options,
          groups,
        }

        dispatch(receiveReplacementOptions(availableOptions))
      })
    })
    .catch(error => dispatch(receiveReplacementReasonsError(error)))
}

export const getCancellationReasons = locale => dispatch => {
  dispatch(requestCancellationOptions())

  return getReasons('cancellation', locale)
    .then(options => {
      if (!options || !options.groups || !options.groups.length) {
        return this.goToHomePage()
      }

      options.groups.forEach(group => {
        const hasOther = group.options.some(option => option.value === 'other')

        if (!hasOther) {
          options.groups[0].options = [
            ...options.groups[0].options,
            {
              label: { i18n: 'commons.other' },
              value: 'other',
            },
          ]
        }
      })
      dispatch(receiveCancellationOptions(options))

      return null
    })
    .catch(error => dispatch(receiveCancellationReasonsError(error)))
}

export const fetchOrderAndReasons = (orderId, locale, type) => dispatch => {
  return loadOrder(orderId)
    .then(order => {
      dispatch(receiveOrder(order))
      if (type === 'replacement') {
        dispatch(getReplacementReasons(locale, order))
      } else {
        dispatch(getCancellationReasons(locale, order))
      }

      return null
    })
    .catch(error => dispatch(receiveOrderError(error)))
}

export const redirect = (orderId, reasonId) => dispatch => {
  dispatch(redirectPage())

  return window.open(
    addBaseURL(
      `/checkout/orderform/createFromCommercialConditions/${orderId}?reason=${reasonId}`
    ),
    '_self'
  )
}

export const cancelOrder = (orderId, reason = '') => async dispatch => {
  dispatch(requestOrderCancellation())
  const data = { reason }

  const url = await checkB2B(
    addBaseURL(`/api/checkout/pub/orders/${orderId}/user-cancel-request`)
  )

  return fetch(url, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(() => {
      goToOrdersHomePageWithCanceledOrder(orderId)
    })
    .catch(error => dispatch(receiveOrderCancellationError(error)))
}

import * as types from '../actions/types'

const initialState = {
  orders: {},
  ordersError: undefined,
  isLoading: true,
  isSubmitting: false,
  isSubmittingOrderCancellation: false,
  parentOrders: [],
  detailedOrders: {},
  context: {
    culture: {
      currency: 'BRL',
    },
  },
}

// eslint-disable-next-line default-param-last
export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_ORDERS: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case types.RECEIVE_ORDERS: {
      return {
        ...state,
        orders: action.basicOrders,
        userOrders: action.userOrders,
        detailedOrders: action.detailedOrders,
        currentPage: action.currentPage,
        pages: action.pages,
        isLoading: false,
      }
    }
    case types.RECEIVE_MORE_ORDERS: {
      return {
        ...state,
        currentPage: action.currentPage,
        pages: action.pages,
        orders: {
          ...state.orders,
          ...action.basicOrders,
        },
        userOrders: state.userOrders
          ? [...state.userOrders, ...action.userOrders]
          : action.userOrders,
      }
    }
    case types.RECEIVE_ORDERS_ERROR: {
      return {
        ...state,
        ordersError: action.error,
        isLoading: false,
      }
    }
    case types.RECEIVE_ORDER: {
      return {
        ...state,
        detailedOrders: {
          ...state.detailedOrders,
          [action.order.orderId]: action.order,
        },
        orderError: undefined,
        isLoading: false,
      }
    }
    case types.RECEIVE_ORDER_ERROR: {
      return {
        ...state,
        orderError: action.error,
        isLoading: false,
      }
    }
    case types.RECEIVE_PARENT_ORDERS: {
      return {
        ...state,
        parentOrders: action.parentOrders,
      }
    }
    case types.REQUEST_CANCELLATION_OPTIONS: {
      return {
        ...state,
        hasFetchedCancellationOptions: false,
      }
    }
    case types.REQUEST_REPLACEMENT_OPTIONS: {
      return {
        ...state,
        hasFetchedReplacementOptions: false,
      }
    }
    case types.RECEIVE_REPLACEMENT_OPTIONS: {
      return {
        ...state,
        replacementOptions: action.availableOptions,
        hasFetchedReplacementOptions: true,
      }
    }
    case types.RECEIVE_CANCELLATION_OPTIONS: {
      return {
        ...state,
        options: action.availableOptions,
        hasFetchedCancellationOptions: true,
      }
    }
    case types.REDIRECT_PAGE: {
      return {
        ...state,
        isSubmitting: true,
      }
    }
    case types.RECEIVE_CANCELLATION_REASONS_ERROR: {
      return {
        ...state,
        hasFetchedCancellationOptions: false,
        cancellationReasonsError: action.error,
      }
    }
    case types.RECEIVE_REPLACEMENT_REASONS_ERROR: {
      return {
        ...state,
        hasFetchedReplacementOptions: false,
        replacementReasonsError: action.error,
      }
    }
    case types.REQUEST_ORDER_CANCELLATION: {
      return {
        ...state,
        isSubmittingOrderCancellation: true,
      }
    }
    case types.RECEIVE_ORDER_CANCELLATION_ERROR: {
      return {
        ...state,
        isSubmittingOrderCancellation: false,
        orderError: action.error,
      }
    }
    default:
      return state
  }
}

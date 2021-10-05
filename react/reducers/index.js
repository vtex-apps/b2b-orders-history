import { combineReducers } from 'redux'

import myOrders from './orders-reducers'

const rootReducer = combineReducers({
  myOrders,
})
export default rootReducer

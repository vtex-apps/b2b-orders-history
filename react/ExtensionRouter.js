import React, { Fragment } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import { Provider } from 'react-redux'

import MyOrders from './pages/MyOrders'
import EditOrder from './pages/EditOrder'
import CancelOrder from './pages/CancelOrder'
import ViewOrder from './pages/ViewOrder'
import configureStore from './store/configureStore'

import './global.css'

const store = configureStore()

/* Router */
const ExtensionRouter = () => (
  <Provider store={store}>
    <Fragment>
      <Route exact path="/orders-history" component={MyOrders} allowSAC />
      <Route
        exact
        path="/orders-history/:orderId"
        component={ViewOrder}
        allowSAC
      />
      <Route
        exact
        path="/orders-history/:orderId/edit"
        component={EditOrder}
        allowSAC
      />
      <Route
        exact
        path="/orders-history/:orderId/cancel"
        component={CancelOrder}
      />
    </Fragment>
  </Provider>
)

export default ExtensionRouter

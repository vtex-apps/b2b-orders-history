import SplunkEvents from 'splunk-events'
import Cookies from 'js-cookie'

import { LOG_RATE } from '../constants'
import { getCallCenterEmail, retrieveSession } from '../actions/utils'

const splunkEvents = new SplunkEvents()

splunkEvents.config({
  endpoint: 'https://splunk-heavyforwarder-public.vtex.com:8088',
  token: 'feee5906-39b2-43a5-bb46-b927b8e01da3',
  injectAditionalInfo: true,
})

export function logAccountName() {
  if (Math.random() > LOG_RATE) return

  const { account } = window.__RUNTIME__
  splunkEvents.logEvent('Important', 'Info', 'MyOrders3x', 'MyOrders3xUrl', {
    account,
  })
}

export async function logEmailInconsistency({
  currentEmail,
  orderEmail,
  orderId,
  detailGuid,
  listingGuid,
  listingResponseGuid,
  detailResponseGuid,
}) {
  const { account } = window.__RUNTIME__

  const callCenterEmail = await getCallCenterEmail()
  const session = await retrieveSession()

  splunkEvents.logEvent(
    callCenterEmail ? 'Important' : 'Critical',
    'Error',
    'UnknownError',
    'WrongOrder',
    {
      account,
      currentEmail,
      orderEmail,
      orderId,
      callCenterEmail,
      detailGuid,
      detailResponseGuid,
      listingGuid,
      listingResponseGuid,
      VtexRCMacIdv7: Cookies.get('VtexRCMacIdv7'),
      session: JSON.stringify(session),
    }
  )
}

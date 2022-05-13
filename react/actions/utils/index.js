import Cookies from 'js-cookie'
import axiosRetry from '@vtex/axios-concurrent-retry'

import axios from '../../utils/customAxios'
import { addBaseURL } from '../../utils'

let session

function getSession() {
  axiosRetry(axios, {
    retries: 3,
    retryTimeout: 1,
    retryDelay: axiosRetry.exponentialDelay,
  })

  return axios
    .get(addBaseURL('/api/sessions/?items=*'))
    .then(({ data }) => data)
}

function getImpersonatedCustomerEmail() {
  return Cookies.get('vtex-impersonated-customer-email')
}

export async function retrieveSession() {
  // eslint-disable-next-line require-atomic-updates
  session = session || (await getSession())

  return session
}

async function getImpersonatedCustomerFromSessionOrCookie() {
  // eslint-disable-next-line require-atomic-updates
  const currentSession = await retrieveSession()

  if (currentSession) {
    return (
      (currentSession.namespaces &&
        currentSession.namespaces.impersonate &&
        currentSession.namespaces.impersonate.storeUserEmail &&
        currentSession.namespaces.impersonate.storeUserEmail.value) ||
      null
    )
  }

  return getImpersonatedCustomerEmail()
}

export async function getCustomerEmail() {
  const currentSession = await retrieveSession()

  const storeUserEmail =
    currentSession &&
    currentSession.namespaces &&
    currentSession.namespaces.profile &&
    currentSession.namespaces.profile.email &&
    currentSession.namespaces.profile.email.value

  return storeUserEmail || getImpersonatedCustomerFromSessionOrCookie()
}

export async function checkB2B(baseUrl) {
  const currentSession = await retrieveSession()

  return currentSession?.namespaces['storefront-permissions']?.organization
    ?.value
    ? baseUrl.replace(/api/gi, 'b2b')
    : baseUrl
}

export async function getOrdersURL(baseUrl, page = '1') {
  session = null

  const customerEmail = await getImpersonatedCustomerFromSessionOrCookie()
  const b2bUrl = await checkB2B(baseUrl)

  return customerEmail
    ? `${b2bUrl}?clientEmail=${customerEmail}&page=${page}`
    : `${b2bUrl}?page=${page}`
}

export async function getOrderDetailURL(baseUrl) {
  const customerEmail = await getImpersonatedCustomerFromSessionOrCookie()
  const b2bUrl = await checkB2B(baseUrl)

  return customerEmail ? `${b2bUrl}?clientEmail=${customerEmail}` : b2bUrl
}

export const parseJSON = response => {
  return response.json()
}

export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  throw response
}

export async function getCallCenterEmail() {
  const currentSession = await retrieveSession()

  const email =
    currentSession &&
    currentSession.namespaces &&
    currentSession.namespaces.authentication &&
    currentSession.namespaces.authentication.adminUserEmail &&
    currentSession.namespaces.authentication.adminUserEmail.value

  return email
}

export const OPERATION_ID_HEADER = 'x-vtex-operation-id'

export function getResponseOperationId(response) {
  return response && response.headers.get(OPERATION_ID_HEADER)
}

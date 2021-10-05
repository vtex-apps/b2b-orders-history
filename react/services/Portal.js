import cache from 'memory-cache'

import axios from '../utils/customAxios'

const FIVE_MINUTES = 5 * (60 * 1000)
const CACHE_REPLACEMENT_OPTIONS_KEY = 'order-replacement-options'
const CACHE_CANCELLATION_OPTIONS_KEY = 'order-cancellation-options'

const DEFAULT_LOCALE = 'pt'
const FILES_ENDPOINT = '/files'
const REPLACEMENT_REASONS_FILENAME = '.order-replacement-reasons'
const CANCELLATION_REASONS_FILENAME = '.order-cancellation-reasons'

class PortalClient {
  static get filesEndpoint() {
    return FILES_ENDPOINT
  }

  static getEditOptions(locale = DEFAULT_LOCALE) {
    const cachedOptions = cache.get(CACHE_REPLACEMENT_OPTIONS_KEY)
    locale = locale.substr(0, 2)

    return new Promise(resolve => {
      if (cachedOptions) {
        return resolve(cachedOptions)
      }

      axios
        .get(
          `${this.filesEndpoint}/${REPLACEMENT_REASONS_FILENAME}_${locale}.json`
        )
        .then(response => {
          cache.put(CACHE_REPLACEMENT_OPTIONS_KEY, response.data, FIVE_MINUTES)
          return resolve(response.data)
        })
    })
  }

  static getCancelOptions(locale = DEFAULT_LOCALE) {
    const cachedOptions = cache.get(CACHE_CANCELLATION_OPTIONS_KEY)
    locale = locale.substr(0, 2)

    return new Promise(resolve => {
      if (cachedOptions) {
        return resolve(cachedOptions)
      }

      axios
        .get(
          `${this.filesEndpoint}/${CANCELLATION_REASONS_FILENAME}_${locale}.json`
        )
        .then(response => {
          cache.put(CACHE_CANCELLATION_OPTIONS_KEY, response.data, FIVE_MINUTES)
          return resolve(response.data)
        })
    })
  }
}

export default PortalClient

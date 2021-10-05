import cache from 'memory-cache'

import axios from '../utils/customAxios'
import { addBaseURL } from '../utils'

const DEFAULT_LOCALE = 'pt'
const FIVE_MINUTES = 5 * (60 * 1000)

const ACRONYM = 'sac'
// const VERSION = process.env.APP_VER
// const PORT = process.env.APP_PORT
const REASONS_VERSION = '1.0.4'

const MD_ENDPOINT = `dataentities/${ACRONYM}/documents`
const IO_ENDPOINT = `io.vtex.com.br/front-libs/self-service-reasons/${REASONS_VERSION}`

const MD_HEADERS = {
  accept: 'application/json',
}

const FILENAMES = {
  REPLACEMENT: 'replacement-reasons',
  CANCELLATION: 'cancellation-reasons',
}

function fetchJSON(filename) {
  return axios
    .get(
      addBaseURL(
        `/api/${MD_ENDPOINT}/${filename}?_fields=locale,groups&_schema=sac-v1`
      ),
      {
        headers: MD_HEADERS,
      }
    )
    .then(response => {
      cache.put(filename, response.data, FIVE_MINUTES)

      return response.data
    })
    .then(data => {
      if (data && Object.keys(data).length > 0) {
        return data
      }

      return axios.get(`//${IO_ENDPOINT}/${filename}.json`).then(response => {
        cache.put(filename, response.data, FIVE_MINUTES)

        return response.data
      })
    })
}

export function getReasons(type, locale = DEFAULT_LOCALE) {
  locale = locale.substr(0, 2)

  const filename = `${FILENAMES[type.toUpperCase()]}_${locale}`
  const cachedOptions = cache.get(filename)

  if (cachedOptions) {
    return Promise.resolve({ ...cachedOptions })
  }

  return fetchJSON(filename)
}

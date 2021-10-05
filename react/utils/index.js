export { default as OrderUtils } from './OrderUtils'

let gguid = 1

export default function getGGUID() {
  return (gguid++ * new Date().getTime() * -1).toString()
}

// necessary to access APIs when rootPath is necessary
const rootPath = (window.__RUNTIME__ && window.__RUNTIME__.rootPath) || ''

export function addBaseURL(url) {
  return `${rootPath}${url}`
}

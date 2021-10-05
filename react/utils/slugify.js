import kebabCase from 'lodash/kebabCase'
import deburr from 'lodash/deburr'

export default function slugify(str) {
  return deburr(kebabCase(str))
}

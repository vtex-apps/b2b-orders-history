import PropTypes from 'prop-types'

export const knownTotalizers = {
  Discounts: 1,
  Items: 1,
  Shipping: 1,
  Tax: 1,
  Interest: 1,
}

// reference: https://github.com/vtex-apps/totalizer-translator/blob/master/react/TranslateTotalizer.js
const TranslateTotalizer = ({ id, totalizer }) => {
  if (totalizer && totalizer.id) id = totalizer.id
  if (id in knownTotalizers) return id
  if (!totalizer) return id || ''
  return totalizer.name || id
}

TranslateTotalizer.propTypes = {
  id: PropTypes.string,
  totalizer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.number,
  }),
}
export default TranslateTotalizer

import PropTypes from 'prop-types'

export const PackageShape = PropTypes.shape({
  address: PropTypes.object,
  deliveryChannel: PropTypes.string,
  deliveryIds: PropTypes.arrayOf(PropTypes.object),
  deliveryWindow: PropTypes.any,
  items: PropTypes.arrayOf(PropTypes.object),
  package: PropTypes.object,
  pickupFriendlyName: PropTypes.string,
  price: PropTypes.number,
  selectedSla: PropTypes.string,
  selectedSlaObj: PropTypes.object,
  selectedSlaType: PropTypes.string,
  seller: PropTypes.string,
  shippingEstimate: PropTypes.string,
  shippingEstimateDate: PropTypes.string,
  slas: PropTypes.arrayOf(PropTypes.object),
})

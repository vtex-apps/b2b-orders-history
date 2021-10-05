export default function getDeliveryName(deliveryPackage) {
  return deliveryPackage.pickupFriendlyName || deliveryPackage.selectedSla
}

import axios from './customAxios'
import { addBaseURL } from '.'

function getSkuVariations(productId, originalSkuId) {
  return axios
    .get(
      addBaseURL(
        `/api/catalog_system/pub/products/search?fq=productId:${productId}`
      )
    )
    .then(({ data }) => data[0].items)
    .then(skus => skus.filter(sku => sku.itemId !== originalSkuId))
}

function getSkusSimulated(skus, seller) {
  const items = skus.map(({ itemId }) => ({
    id: itemId,
    quantity: 1,
    seller,
  }))

  return axios
    .post(addBaseURL('/api/checkout/pub/orderForms/simulation'), { items })
    .then(({ data }) => data.items)
}

function findSamePriceVariations(item) {
  return getSkuVariations(item.productId, item.id).then(skus => {
    const hasSkus = skus.length > 0
    if (!hasSkus) {
      return false
    }
    return getSkusSimulated(skus, item.seller).then(simulatedSkus => {
      const isSamePrice = simulatedSkus.find(sku => sku.price === item.price)
      return !!isSamePrice
    })
  })
}

export function skuReplacementEnabled(order) {
  const { items } = order

  const promises = items.map(findSamePriceVariations)

  return Promise.all(promises).then(values => {
    const hasReplaceableItem = values.find(v => v === true)
    return hasReplaceableItem
  })
}

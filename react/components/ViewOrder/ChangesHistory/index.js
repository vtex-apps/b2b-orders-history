import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import ArrowIcon from './ArrowIcon'
import ChangeOrderHeader from './ChangeOrderHeader'
import ChangedItems from './ChangeItems'

const ITEMS_TOTAL = 'items'
const CHANGE_TOTAL = 'change'

const ChangesHistory = ({
  items,
  totals,
  creationDate,
  changes,
  currencyCode,
}) => {
  const itemsAdded = changes.reduce(
    (all, { itemsAdded: added }) => all.concat(added),
    []
  )
  const itemsRemoved = changes.reduce(
    (all, { itemsRemoved: removed }) => all.concat(removed),
    []
  )

  const original = {
    items,
    totals: totals.filter(({ id }) => id.toLowerCase() === ITEMS_TOTAL),
    date: creationDate,
  }

  const changed = {
    items: items.slice(),
    totals: totals.filter(({ id }) =>
      [ITEMS_TOTAL, CHANGE_TOTAL].includes(id.toLowerCase())
    ),
    date: changes[changes.length - 1].receipt.date,
  }

  if (itemsAdded) {
    itemsAdded.forEach(itemAdded => {
      const itemIndex = changed.items.findIndex(({ id }) => id === itemAdded.id)
      if (itemIndex > -1) {
        changed.items[itemIndex] = {
          ...changed.items[itemIndex],
          quantity: changed.items[itemIndex].quantity + itemAdded.quantity,
        }
      } else {
        changed.items.push(itemAdded)
      }
    })
  }

  if (itemsRemoved) {
    itemsRemoved.forEach(itemRemoved => {
      const itemIndex = changed.items.findIndex(
        ({ id }) => id === itemRemoved.id
      )
      if (itemIndex > -1) {
        changed.items[itemIndex] = {
          ...changed.items[itemIndex],
          quantity: changed.items[itemIndex].quantity - itemRemoved.quantity,
        }
      }
    })

    changed.items = changed.items.filter(({ quantity }) => quantity > 0)
  }

  return (
    <div className="mt6">
      <div className="w-100 flex justify-between">
        <div className="w-45">
          <ChangeOrderHeader
            title={<FormattedMessage id="order.change.originalOrder" />}
            date={original.date}
            totals={original.totals}
            currencyCode={currencyCode}
          />
        </div>
        <div className="w-45">
          <ChangeOrderHeader
            title={<FormattedMessage id="order.change.currentOrder" />}
            date={changed.date}
            totals={changed.totals}
            currencyCode={currencyCode}
          />
        </div>
      </div>
      <div className="w-100 flex mt8">
        <div className="w-45">
          <ChangedItems items={original.items} currencyCode={currencyCode} />
        </div>
        <div className="w-10 flex items-center justify-center">
          <ArrowIcon />
        </div>
        <div className="w-45">
          <ChangedItems items={changed.items} currencyCode={currencyCode} />
        </div>
      </div>
    </div>
  )
}

ChangesHistory.propTypes = {
  changes: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  totals: PropTypes.arrayOf(PropTypes.object).isRequired,
  currencyCode: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  arrow: PropTypes.bool,
}

export default ChangesHistory

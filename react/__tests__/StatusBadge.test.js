/* eslint-disable jest/no-mocks-import */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import DeliveredOrder from '../__mocks__/DeliveredOrder.json'
import UndeliveredOrder from '../__mocks__/NotDeliveredOrder.json'
import PickUpOrderUndelivered from '../__mocks__/PickUpOrderUndelivered.json'
import PickUpOrderDelivered from '../__mocks__/PickUpOrderDelivered.json'
import StatusBadge from '../components/commons/StatusBadge'

describe('Status Badge', () => {
  it('should show "delivered" label for a delivered order', () => {
    const { queryByText } = render(<StatusBadge order={DeliveredOrder} />)

    expect(queryByText('Delivered')).toBeInTheDocument()
  })

  it('should NOT show "delivered" label for an undelivered order', () => {
    const { queryByText } = render(<StatusBadge order={UndeliveredOrder} />)

    expect(queryByText('Delivered')).not.toBeInTheDocument()
  })

  it('should show "shipped" label for an undelivered order', () => {
    const { queryByText } = render(
      <StatusBadge order={PickUpOrderUndelivered} />
    )

    expect(queryByText('Ready for pickup')).toBeInTheDocument()
  })

  it('should NOT show "ready for pickup" label for an undelivered order', () => {
    const { queryByText } = render(<StatusBadge order={PickUpOrderDelivered} />)

    expect(queryByText('Ready for pickup')).not.toBeInTheDocument()
  })
})

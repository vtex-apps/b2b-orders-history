import React from 'react'
import { render } from '@vtex/test-tools/react'

import Totals from '../components/Order/Totals'

describe('Totals', () => {
  const currencyCode = 'BRL'
  const totals = [
    {
      id: 'Items',
      name: 'Total dos Itens',
      value: 2000,
    },
    {
      id: 'Discounts',
      name: 'Total dos Descontos',
      value: 0,
    },
    {
      id: 'Shipping',
      name: 'Total do Frete',
      value: 0,
    },
    {
      id: 'Tax',
      name: 'Total da Taxa',
      value: 0,
    },
  ]

  it('should not show interest if referenceValue is zero', () => {
    const transactions = [
      {
        isActive: true,
        transactionId: '598FE5A93FD44BC086DE0380EFD267C8',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: 'F38B37C16F144ABB92FD92F285F9DAB9',
            paymentSystem: '4',
            paymentSystemName: 'Mastercard',
            value: 2000,
            installments: 1,
            referenceValue: 0,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '549167',
            lastDigits: '8484',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: '55669603',
            dueDate: null,
            connectorResponses: {
              Tid: '55669603',
              ReturnCode: null,
              Message: null,
              authId: '669603',
            },
          },
        ],
      },
    ]

    const { queryByText } = render(
      <Totals
        totals={totals}
        currencyCode={currencyCode}
        transactions={transactions}
      />
    )

    expect(queryByText('Interest')).toBeNull()
  })

  it('should show interest when referenceValue is different from value', () => {
    const transactions = [
      {
        isActive: true,
        transactionId: '598FE5A93FD44BC086DE0380EFD267C8',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: 'F38B37C16F144ABB92FD92F285F9DAB9',
            paymentSystem: '4',
            paymentSystemName: 'Mastercard',
            value: 2000,
            installments: 1,
            referenceValue: 1900,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '549167',
            lastDigits: '8484',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: '55669603',
            dueDate: null,
            connectorResponses: {
              Tid: '55669603',
              ReturnCode: null,
              Message: null,
              authId: '669603',
            },
          },
        ],
      },
    ]

    const { getByText } = render(
      <Totals
        totals={totals}
        currencyCode={currencyCode}
        transactions={transactions}
      />
    )

    expect(getByText('Interest')).toBeTruthy()
  })

  it('should not show interest when referenceValue is the same as value', () => {
    const transactions = [
      {
        isActive: true,
        transactionId: '598FE5A93FD44BC086DE0380EFD267C8',
        merchantName: 'RECORRENCIAQA',
        payments: [
          {
            id: 'F38B37C16F144ABB92FD92F285F9DAB9',
            paymentSystem: '4',
            paymentSystemName: 'Mastercard',
            value: 2000,
            installments: 1,
            referenceValue: 2000,
            cardHolder: null,
            cardNumber: null,
            firstDigits: '549167',
            lastDigits: '8484',
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'creditCard',
            tid: '55669603',
            dueDate: null,
            connectorResponses: {
              Tid: '55669603',
              ReturnCode: null,
              Message: null,
              authId: '669603',
            },
          },
        ],
      },
    ]

    const { queryByText } = render(
      <Totals
        totals={totals}
        currencyCode={currencyCode}
        transactions={transactions}
      />
    )

    expect(queryByText('Interest')).toBeNull()
  })
})

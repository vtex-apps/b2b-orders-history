import React from 'react'
import PropTypes from 'prop-types'
import { AddressSummary, AddressRules } from 'vtex.address-form'

const Address = ({ address }) => {
  return (
    <div className="lh-copy f6">
      <strong>{address.receiverName}</strong>
      <br />
      <AddressRules country={address.country} shouldUseIOFetching>
        <AddressSummary address={address} />
      </AddressRules>
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
}

export default Address

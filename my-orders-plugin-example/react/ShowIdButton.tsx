import React, { FC, useState } from 'react'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

interface Props {
  orderId: string
}

const ShowIdButton: FC<Props> = ({ orderId }) => {
  const [show, setShow] = useState<boolean>(false)

  return (
    <div className="mt3">
      <Button block onClick={() => setShow(prevState => !prevState)}>
        {show ? (
          <FormattedMessage id="store/extraActions.hideOrderId" />
        ) : (
          <FormattedMessage id="store/extraActions.showOrderId" />
        )}
      </Button>
      {show && <div className="pt3 c-muted-1 tc w-100">{orderId}</div>}
    </div>
  )
}

export default ShowIdButton

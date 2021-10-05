# My Orders

My Orders pages powered by Render

## Table of Contents

- [Prerequisites](#Prerequisites)
- [Running](#Running)
- [Permission Error](#permission)
- [Features](#Features)
- [Versions](#Versions)

# Prerequisites

To get the project up and running you need to have `VTEX CLI` installed on your machine.

# Running

`vtex link`

# Permission Error
## How to see the orders' page without getting a permission error?

- Go to `{workspace}--{account}.myvtex{dev}.com/myorders` and see that there will be a message saying you need to log in
- Go to `{accountName}.vtexcommercestable.com.br/account/orders` and log in
- When you're logged in and you can see your orders, copy the `VtexIdclientAutCookie_{accountName}` cookie
- Create a new cookie on the `myvtex` domain with name `VtexIdclientAutCookie_{accountName}` and value copied from the last step
- Refresh the page and now you won't have any more permission issues

# Features

This app provides an extension point that allows apps to add buttons and actions to the My-Orders-App listing.

## Adding an extra action

### Setting up

First, make sure you have the store-builder as a dependency in you `manifest.json`:

```diff
    "builders": {
      "messages": "1.x",
      "react": "3.x",
+     "store": "0.x"
    },
```

Now, create the file `store/interfaces.json` and define the interface:

```json
{
  "my-orders-extra-actions.show-id-button": {
    "component": "ShowIdButton"
  }
}
```

The names `show-id-button` and `ShowIdButton` may be whatever it makes more sense for you app.

Lastly, create a `store/plugins.json` file like so:

```json
{
  "my-orders-extra-actions-container > my-orders-extra-actions": "my-orders-extra-actions.show-id-button"
}
```

The name `show-id-button` has to be the same as the one chosen at `store/interfaces.json`.

#### Creating an extra actions component

You can create a component that renders anything. You can get the OrderId from the component props if needed.

**Example**

```js
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
```

## Running `my-orders-plugin-example`

Simply clone this repository and run `vtex link` inside the `my-orders-plugin-example` folder.

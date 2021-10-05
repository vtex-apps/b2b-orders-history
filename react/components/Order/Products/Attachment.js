import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import {
  FormattedMessage,
  FormattedDate,
  injectIntl,
  intlShape,
} from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { translations } from 'vtex.subscriptions-commons'

import arrow from '../../../assets/arrow-up.svg'
import slugify from '../../../utils/slugify'

const ATTACHMENT_DATE_VALUES = [
  'vtex.subscription.key.validity.begin',
  'vtex.subscription.key.validity.end',
]

const CSS_HANDLES = [
  'attachment',
  'attachmentGiftWrap',
  'attachmentInfo',
  'attachmentKey',
  'attachmentValue',
  'attachmentName',
]

function getFormattedSubscriptionKey(key) {
  return (
    <FormattedMessage
      id="order.subscription.key.frequency"
      defaultMessage={key}
    />
  )
}

function getFormattedSubscriptionValue(key, value, intl) {
  if (ATTACHMENT_DATE_VALUES.includes(key)) {
    return <FormattedDate value={new Date(value)} />
  }

  const valueParts = value.trim().split(' ')
  let [interval, periodicity] = valueParts

  if (!periodicity || !interval) return ''

  switch (periodicity) {
    case 'day':
      periodicity = 'DAILY'
      break

    default:
      periodicity = `${periodicity}ly`.toUpperCase()
      break
  }

  return translations.translatePeriodicity(intl, `${periodicity}`, interval)
}

const Attachment = ({ name, content, intl }) => {
  const slugName = slugify(name)
  const cssHandles = useCssHandles(CSS_HANDLES)

  const isGiftWrap = name === 'message' && content.text
  if (isGiftWrap) {
    return (
      <tr
        className={`${cssHandles.attachment} ${cssHandles.attachmentGiftWrap} myo-attachment-gift-wrap`}
        slug={slugName}
      >
        <td className="pa0 pv5 v-mid overflow-hidden">
          <div className="ml3 fl overflow-hidden w-80-ns">
            <blockquote className="gift-message">{content.text}</blockquote>
          </div>
        </td>
        <td className="dn dtc-ns" />
        <td />
        <td className="pa0 pv5 v-mid" />
      </tr>
    )
  }

  const isSubscription = name.indexOf('vtex.subscription') === 0

  const attachmentTitle = isSubscription ? (
    <FormattedMessage id="order.subscription" />
  ) : (
    name
  )

  const attachmentInfo = map(content, (value, key) => {
    const elementKey = `${key}-${value}-${name}`
    const shouldNotDisplay = isSubscription && !value

    if (shouldNotDisplay) {
      return <div key={elementKey} className="dn" />
    }

    let formattedKey = key
    let formattedValue = value

    if (isSubscription) {
      formattedKey = getFormattedSubscriptionKey(key)
      formattedValue = getFormattedSubscriptionValue(key, value, intl)
    }

    // for compatibility
    const mainClassName = `myo-attachment-${slugify(name)}-${slugify(key)}`
    return (
      <div
        key={elementKey}
        className={`${cssHandles.attachmentInfo} ${mainClassName} myo-attachment-info pb2`}
        name={slugify(name)}
      >
        <span className={`${cssHandles.attachmentKey} myo-attachment-key fw7`}>
          {formattedKey}:&nbsp;
        </span>
        <span className={`${cssHandles.attachmentValue} myo-attachment-value`}>
          {formattedValue}
        </span>
      </div>
    )
  })

  return (
    <tr
      className={`${cssHandles.attachment} myo-attachment bg-muted-5`}
      slug={slugName}
    >
      <td className="pv3 tl v-top v-mid relative">
        <div className="ml9-ns mt3 fl w-80-ns">
          <img
            src={arrow}
            alt=""
            className="absolute"
            style={{ top: '-1px' }}
          />
          <p
            className={`${cssHandles.attachmentName} myo-attachment-${slugName} myo-attachment-name f5 mb0`}
          >
            {attachmentTitle}
          </p>
          <div className="pt5">{attachmentInfo}</div>
        </div>
      </td>
      <td className="pv3 tl v-top dn dtc-ns" />
      <td />
      <td className="pv3 tl v-top v-mid" />
    </tr>
  )
}

Attachment.propTypes = {
  name: PropTypes.string,
  content: PropTypes.object,
  intl: intlShape.isRequired,
}

export default injectIntl(Attachment)

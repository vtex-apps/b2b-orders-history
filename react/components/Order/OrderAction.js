import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'vtex.my-account-commons/Router'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['font']

const OrderAction = ({
  children,
  classID,
  labelID,
  warning,
  onClick,
  route,
  isInternalRoute,
}) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const style = `${classID} ${
    warning ? 'c-danger hover-c-danger' : 'c-link hover-c-link'
  } pa0 bg-transparent bn cf db link tl w5 f6 fw4 flex items-center mb5`

  const text = (
    <span className={`ml3 ${cssHandles.font} myo-font no-underline`}>
      <FormattedMessage id={labelID} />
    </span>
  )

  const icon = (
    <svg
      className=""
      fill={warning ? '#FF4C4C' : '#134CD8'}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 16 16"
      width="16"
      height="16"
    >
      <title>
        <FormattedMessage id={labelID} />
      </title>
      {children}
    </svg>
  )

  if (route) {
    if (isInternalRoute) {
      return (
        <Link to={route} className={style}>
          {icon} {text}
        </Link>
      )
    }
    return (
      <a
        href={route}
        rel="noopener noreferrer"
        target="_blank"
        className={style}
      >
        {icon} {text}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={`pointer ${style}`}>
      {icon} {text}
    </button>
  )
}

OrderAction.propTypes = {
  classID: PropTypes.string.isRequired,
  labelID: PropTypes.string.isRequired,
  warning: PropTypes.string,
  onClick: PropTypes.func,
  route: PropTypes.string,
  children: PropTypes.object,
  isInternalRoute: PropTypes.bool,
}

export default OrderAction

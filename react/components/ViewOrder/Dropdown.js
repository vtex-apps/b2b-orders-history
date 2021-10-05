/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

class DropdownButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }

    this.wrapperRef = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleCloseDropdown)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleCloseDropdown)
  }

  handleOpenDropdown = () => this.setState({ isOpen: true })

  handleCloseDropdown = event => {
    // Only close when clicking outside the Dropdown...
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ isOpen: false })
    }
  }

  render() {
    const isOpenStyle = this.state.isOpen ? 'db' : 'dn'
    const label = this.props.intl.formatMessage({ id: 'order.moreOptions' })

    return (
      <div
        className="pointer dib f6 link underline c-link hover-c-link relative"
        onClick={this.handleOpenDropdown}
        ref={this.wrapperRef}
      >
        <img
          src={this.props.icon}
          className="hh1 w1 top-0"
          style={{ verticalAlign: 'sub' }}
          alt=""
        />
        <span className="dib" style={{ marginLeft: '8px' }}>
          {label}
        </span>
        <div
          className={`tl ph5 pv3 left-0 absolute overflow-hidden ma0 ba br2 bg-base b--muted-5 mw4 ${isOpenStyle}`}
          style={{
            boxShadow: '0px 0px 15px -5px rgba(0,0,0,0.20)',
            top: '110%',
            left: '0',
          }}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}

DropdownButton.propTypes = {
  icon: PropTypes.any,
  label: PropTypes.string,
  children: PropTypes.node,
  intl: intlShape,
}

export default injectIntl(DropdownButton)

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { FormattedDate, FormattedTime, intlShape, injectIntl } from 'react-intl'
import orderBy from 'lodash/orderBy'

const PAGE_SIZE = 3

class TrackingProgress extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: PAGE_SIZE,
    }
  }

  handleViewMore = () => {
    this.setState(prevState => ({ visible: prevState.visible + PAGE_SIZE }))
  }

  render() {
    const { courierStatus } = this.props
    const data = orderBy(
      courierStatus.data,
      date => new Date(date.lastChange),
      ['desc']
    )
    const visibleColumns = data.slice(0, this.state.visible)
    const isViewMoreVisible = this.state.visible < data.length

    if (courierStatus == null || data.length === 0) return null

    return (
      <div className="pv5 f6">
        <MediaQuery minWidth={640}>
          <table
            className="pa3 ba b--muted-5 bw1 w-100 collapse"
            style={{ borderCollapse: 'collapse', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th className="pa3 tl">
                  <span className="pl3 ttu">
                    {this.props.intl.formatMessage({
                      id: 'order.tracking.date',
                    })}
                  </span>
                </th>
                <th className="pa3 tl ttu">
                  {this.props.intl.formatMessage({ id: 'order.tracking.time' })}
                </th>
                <th className="pa3 tl ttu">
                  {this.props.intl.formatMessage({
                    id: 'order.tracking.status',
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleColumns.map(info => {
                return (
                  <tr className="pa3 bt b--muted-5 bw1" key={info.date}>
                    <td className="pa3 w-10">
                      <span className="pl3">
                        {this.props.intl.formatDate(info.lastChange, {
                          timeZone: 'UTC',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="pa3 w-10">
                      <FormattedTime value={info.lastChange} timeZone="UTC" />
                    </td>
                    <td className="pa3 w-20">{info.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </MediaQuery>
        <MediaQuery maxWidth={639}>
          <table className="pa3 ba b--muted-5 bw1 w-100 collapse">
            <thead>
              <tr>
                <th className="pa3 tl">
                  <span className="pl3 ttu">
                    {this.props.intl.formatMessage({
                      id: 'order.tracking.date',
                    })}
                  </span>
                </th>
                <th className="pa3 tl">
                  <span className="ttu">
                    {this.props.intl.formatMessage({
                      id: 'order.tracking.status',
                    })}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleColumns.map(info => {
                return (
                  <tr key={info.date} className="pa3 bt b--muted-5 bw1">
                    <td className="pa3 w-20">
                      <div className="flex flex-column">
                        <FormattedDate value={info.lastChange} timeZone="UTC" />
                        <div className="f7">
                          <FormattedTime
                            value={info.lastChange}
                            timeZone="UTC"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="pa3">{info.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </MediaQuery>
        {isViewMoreVisible && (
          <div
            onClick={this.handleViewMore}
            className="pa3 pointer bl br bb b--muted-5 bw1 flex justify-center"
          >
            <span className="c-on-action-secondary">
              {this.props.intl.formatMessage({ id: 'order.tracking.showMore' })}
            </span>
          </div>
        )}
      </div>
    )
  }
}

TrackingProgress.propTypes = {
  courierStatus: PropTypes.object,
  intl: intlShape.isRequired,
}

export default injectIntl(TrackingProgress)

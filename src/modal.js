import React from 'react'
import {Modal as ReactModal} from 'react-overlays'

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  scrollContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 'calc(100% - 160px)',
    padding: '80px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    position: 'static',
    flex: 1,
    border: 'none',
    background: 'none',
    overflow: 'visible',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    maxWidth: 640,
    pointerEvents: 'auto'
  }
}

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.handleScrollContainerClick = this.handleScrollContainerClick.bind(this)
  }

  handleScrollContainerClick (e) {
    if (e.target !== e.currentTarget) return
    this.props.closeModal()
  }

  render () {
    const {component: Component, closeModal} = this.props
    const dialog = Component ? <Component onCloseClick={closeModal} /> : <div />
    return (
      <ReactModal
        show={!!Component}
        onHide={closeModal}
        style={styles.backdrop}
      >
        <div style={styles.scrollContainer} onClick={this.handleScrollContainerClick}>
          <div style={styles.content}>
            {dialog}
          </div>
        </div>
      </ReactModal>
    )
  }
}

module.exports = Modal

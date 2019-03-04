import React from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'

class Scroll extends React.Component {
    static propTypes = {
        onPullingUp: PropTypes.func,
    }
    static defaultProps = {
        onPullingUp: () => {}
    }

    componentDidMount () {
        this.initScroll()
    }

    componentDidUpdate () {
        this.refresh()
    }

    componentWillUnmount () {
        this.destroy()
    }

    initScroll = () => {
        this.scroll = new BScroll(this.wrapper, {
            click: true,
            mouseWheel: true,
            pullUpLoad: true
        })
        this.scroll.on('pullingUp', this.props.onPullingUp)
    }
    refresh = () => {
        this.scroll && this.scroll.refresh()
    }
    finishPullUp = () => {
        this.scroll && this.scroll.finishPullUp()
    }
    scrollToElement = (el, time, offsetX, offsetY, easing) => {
        this.scroll && this.scroll.scrollToElement(el, time, offsetX, offsetY, easing)
    }
    scrollTo = (x, y, time, easing) => {
        this.scroll && this.scroll.scrollTo(x, y, time, easing)
    }
    destroy = () => {
        this.scroll.destroy()
        this.scroll = null
    }

    render () {
        return (
            <div style={{height: '100%', width: '100%', overflow: 'hidden'}} ref={wrapper => this.wrapper = wrapper}>
                {this.props.children}
            </div>
        )
    }
}

export default Scroll
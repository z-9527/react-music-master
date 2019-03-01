import React from 'react'
import style from './style/index.module.less'
import PropTypes from 'prop-types'

class ProgressCircle extends React.Component {
    static propTypes = {
        radius: PropTypes.number,
        percent: PropTypes.number,
    }
    static defaultProps = {
        radius: 100,
        percent: 0
    }

    render () {
        const {radius, percent} = this.props
        const dashArray = Math.PI * 100
        const dashOffset = (1 - percent) * dashArray

        return (
            <div className={style['progress-circle']} style={{width:radius,height:radius}}>
                <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                    <circle className={style['progress-background']} r="50" cx="50" cy="50" fill="transparent"/>
                    <circle className={style['progress-bar']} r="50" cx="50" cy="50" fill="transparent"
                            strokeDasharray={dashArray} strokeDashoffset={dashOffset}/>
                </svg>
                {this.props.children}
            </div>
        )
    }
}

export default ProgressCircle
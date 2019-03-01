import React from 'react'
import style from './style/index.module.less'
import PropTypes from 'prop-types'

const progressBtnWidth = 16

class ProgressBar extends React.Component {
    static propTypes = {
        percent: PropTypes.number,
        percentChange: PropTypes.func,
    }
    static defaultProps = {
        percent: 0,
        percentChange: () => {}
    }
    state = {
        _percent: 0
    }

    //react新的生命周期
    static getDerivedStateFromProps (nextProps, prevState) {
        const {percent} = nextProps
        // 当传入的type发生变化的时候，更新state
        if (percent !== prevState._percent) {
            return {
                _percent: percent,
            }
        }
        // 否则，对于state不进行任何操作
        return null
    }

    progressClick = (e) => {
        const rect = this.bar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        const percent = offsetWidth / this.bar.clientWidth

        this.props.percentChange(percent)

    }

    render () {
        const {_percent} = this.state
        let barWidth = 0
        if (this.bar) {
            barWidth = this.bar.clientWidth - progressBtnWidth
        }
        const offsetWidth = _percent * barWidth

        return (
            <div className={style['progress-bar']} ref={bar => this.bar = bar} onClick={this.progressClick}>
                <div className={style['bar-inner']}>
                    <div className={style.progress} style={{width: `${offsetWidth}px`}}>
                    </div>
                    <div className={style['progress-btn-wrapper']} style={{transform: `translateX(${offsetWidth}px)`}}>
                        <div className={style['progress-btn']}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressBar
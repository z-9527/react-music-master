import React from 'react'
import style from './style/index.module.less'
import PropTypes from 'prop-types'

const progressBtnWidth = 16
let touch = null

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

    //react新的生命周期,但是拿不到this。这里是一个很典型的应用，percent既要同步外面歌曲播放的变化，组件中又可以滑动进度条来改变percent，所以定义了一个_percent
    static getDerivedStateFromProps (nextProps, prevState) {
        const {percent} = nextProps
        // 当传入的type发生变化的时候，更新state
        if (percent !== prevState._percent && !touch) {
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
        const percent = offsetWidth / (this.bar.clientWidth - progressBtnWidth)
        this.props.percentChange(percent)
    }
    onTouchStart = (e) => {
        touch = {
            startX: e.touches[0].pageX,
            left: this.progress.clientWidth
        }
    }
    onTouchMove = (e) => {
        if(!touch){
            return
        }
        const touchMoveX = e.touches[0].pageX - touch.startX
        const width = this.bar.clientWidth - progressBtnWidth
        const offsetWidth = Math.min(width, Math.max(0, touch.left + touchMoveX))
        this.setState({
            _percent: offsetWidth / width
        })
    }
    onTouchEnd = () => {
        touch = null
        this.props.percentChange(this.state._percent)
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
                    <div className={style.progress} style={{width: `${offsetWidth}px`}}
                         ref={progress => this.progress = progress}>
                    </div>
                    <div
                        onTouchStart={this.onTouchStart}
                        onTouchMove={this.onTouchMove}
                        onTouchEnd={this.onTouchEnd}
                        className={style['progress-btn-wrapper']}
                        style={{transform: `translateX(${offsetWidth}px)`}}>
                        <div className={style['progress-btn']}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressBar
import React from 'react'
import style from './style/normalPlayer.module.less'
import { inject, observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import './style/animate.less'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/components/ProgressBar'
import { formatTime } from '@/utils/util'
import Scroll from '@/components/Scroll'

@inject('appStore') @observer
class NormalPlayer extends React.Component {
    state = {
        currentShow: 'cd',
    }

    componentDidUpdate (prevProps) {
        const changeLine = this.props.playingLineNum !== prevProps.playingLineNum
        const changeFull = this.props.isFullScreen !== prevProps.isFullScreen
        if ((!this.touch && changeLine) || changeFull) {
            this.scrollToCurrent()
        }
    }

    scrollToCurrent = () => {
        clearTimeout(this.timer)
        const {playingLineNum: lineNum} = this.props.appStore
        if (lineNum > 5) {
            let lineEl = this[`lyricLine${lineNum - 5}`]
            this.lyricList && this.lyricList.scrollToElement(lineEl, 1000)
        } else {
            this.lyricList && this.lyricList.scrollTo(0, 0, 1000)
        }
    }

    close = () => {
        this.props.appStore.setFullScreen(false)
    }
    _getPosAndScale = () => {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
            x,
            y,
            scale
        }
    }
    onEnter = () => {
        //其他钩子函数有问题，所以没有使用
        const {x, y, scale} = this._getPosAndScale()
        const animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0,0,0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0,0,0) scale(1)`
            }
        }
        animations.registerAnimation({
            name: 'move',
            animation,
            presets: {
                duration: 400,
                easing: 'linear'
            }
        })
        animations.runAnimation(this.cdWrapper, 'move')
    }
    togglePlay = () => {
        this.props.appStore.togglePlay()
    }
    setLikes = () => {
        this.props.appStore.setLikes(this.props.appStore.currentSong)
    }
    changeMode = () => {
        this.props.appStore.changeMode()
    }
    prev = () => {
        this.props.appStore.changeSong('prev')
    }
    next = () => {
        this.props.appStore.changeSong('next')
    }
    onPercentChange = (percent) => {
        this.props.appStore.onPercentChange(percent)
    }
    middleTouchStart = (e) => {
        const touch = e.touches[0]
        this.touch = {
            startX: touch.pageX,
            startY: touch.pageY,
        }
    }
    middleTouchMove = (e) => {
        if (!this.touch) {
            return
        }
        const touch = e.touches[0]
        //计算X、Y方向的移动距离
        const offsetX = touch.pageX - this.touch.startX
        const offsetY = touch.pageY - this.touch.startY
        if (Math.abs(offsetY) > Math.abs(offsetX)) {
            //如果Y轴方向移动距离大于X轴则return
            return
        }
        const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
        const translateX = Math.min(0, Math.max(-window.innerWidth, left + offsetX))
        this.touch.percent = Math.abs(translateX / window.innerWidth)
        const opacity = 1 - this.touch.percent
        this.animationDom(translateX, opacity, 0)

    }
    middleTouchEnd = () => {
        let translateX = 0
        let opacity = 0
        if (this.state.currentShow === 'cd') {
            if (this.touch.percent > 0.1) {
                translateX = -window.innerWidth
                opacity = 0
                this.setState({
                    currentShow: 'lyric'
                })
            } else {
                translateX = 0
                opacity = 1
            }
        } else {
            if (this.touch.percent < 0.9) {
                translateX = 0
                opacity = 1
                this.setState({
                    currentShow: 'cd'
                })
            } else {
                translateX = -window.innerWidth
                opacity = 0
            }
        }
        this.animationDom(translateX, opacity, 300)
        this.timer = setTimeout(() => {
            this.scrollToCurrent()
        }, 1000)
        this.touch = null

    }
    animationDom = (translateX, opacity, duration) => {
        this.middleR.style.transform = `translateX(${translateX}px)`
        this.middleR.style.transitionDuration = `${duration}ms`
        this.middleL.style.opacity = opacity
        this.middleL.style.transitionDuration = `${duration}ms`
    }

    render () {
        const {currentSong, isFullScreen, playing, likeSongs, mode, percent, currentTime, songReady, playingLyric, lyric, playingLineNum} = this.props.appStore
        const {currentShow} = this.state
        const isExist = likeSongs.some(item => item.id === currentSong.id)
        const icons = ['icon-xunhuanbofang', 'icon-suijibofang', 'icon-danquxunhuan']

        return (
            <CSSTransition
                onEnter={this.onEnter}
                timeout={300}
                classNames={'normal'}
                in={isFullScreen}>
                <div className={style['normal-player']} style={{display: isFullScreen ? '' : 'none'}}>
                    <div className={style.background}>
                        <img src={currentSong.image} alt=''/>
                    </div>
                    <div className={`${style.top} top`}>
                        <div className={style.back} onClick={this.close}>
                            <span className={'iconfont icon-jiantouarrow483'}/>
                        </div>
                        <h2>{currentSong.name}</h2>
                        <h3>{currentSong.artists}</h3>
                    </div>
                    <div className={style.middle} onTouchStart={this.middleTouchStart}
                         onTouchMove={this.middleTouchMove} onTouchEnd={this.middleTouchEnd}>
                        <div className={style['middle-left']} ref={middleL => this.middleL = middleL}>
                            <div className={style['image-wrapper']} ref={el => this.cdWrapper = el}>
                                <img src={currentSong.image} alt=""
                                     className={`rotate ${playing ? '' : 'rotate-pause'}`}/>
                            </div>
                            <div className={style['playing-lyric-wrapper']}>
                                <div className={style['playing-lyric']}>{songReady ? playingLyric : '正在缓冲...'}</div>
                            </div>
                        </div>
                        <div className={style['middle-right']} ref={middleR => this.middleR = middleR}>
                            <div className={style['lyric-wrapper']}>
                                <Scroll ref={lyricList => this.lyricList = lyricList}>
                                    <ul>
                                        {lyric && lyric.lines.map((item, index) => <li key={index}
                                                                                       ref={lyricLine => this[`lyricLine${index}`] = lyricLine}
                                                                                       className={`${style.text} ${playingLineNum === index ? style.current : ''}`}>{item.txt}</li>)}
                                    </ul>
                                </Scroll>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.bottom} bottom`}>
                        <div className={style['dot-wrapper']}>
                            <span className={`${style.dot} ${currentShow === 'cd' ? style.active : ''}`}/>
                            <span className={`${style.dot} ${currentShow === 'lyric' ? style.active : ''}`}/>
                        </div>
                        <div className={style['progress-wrapper']}>
                            <div className={style.time}>{formatTime(currentTime)}</div>
                            <div className={style['bar-wrapper']}>
                                <ProgressBar percent={percent} percentChange={this.onPercentChange}/>
                            </div>
                            <div className={style.time}>{formatTime(currentSong.duration)}</div>
                        </div>
                        <div className={`${style['control-wrapper']} ${songReady ? '' : style.disable}`}>
                            <div><span className={`iconfont ${icons[mode]}`} onClick={this.changeMode}/></div>
                            <div><span className={'iconfont icon-shangyishou'} onClick={this.prev}/></div>
                            <div><span className={`iconfont ${playing ? 'icon-bofang2' : 'icon-play_icon'}`}
                                       onClick={this.togglePlay}/></div>
                            <div><span className={'iconfont icon-xiayishou'} onClick={this.next}/></div>
                            <div><span className={`iconfont ${isExist ? 'icon-xihuan1' : 'icon-xihuan'}`}
                                       onClick={this.setLikes}/>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default NormalPlayer
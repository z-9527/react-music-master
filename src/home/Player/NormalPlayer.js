import React from 'react'
import style from './style/normalPlayer.module.less'
import { inject, observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import './style/animate.less'
import animations from 'create-keyframe-animation'
import ProgressBar from '@/components/ProgressBar'
import { formatTime } from '@/utils/util'

@inject('appStore') @observer
class NormalPlayer extends React.Component {
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
    setLikes = (isExist) => {
        this.props.appStore.setLikes({
            isAdd: !isExist,
            song: this.props.appStore.currentSong
        })
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
        console.log(percent)
    }

    render () {
        const {currentSong, isFullScreen, playing, likeSongs, mode, percent,currentTime} = this.props.appStore
        const isExist = likeSongs.some(item => item.id === currentSong.id)
        const icons = ['icon-xunhuanbofang', 'icon-suijibofang', 'icon-danquxunhuan']

        return (
            <CSSTransition
                onEnter={this.onEnter}
                timeout={10}
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
                    <div className={style.middle}>
                        <div className={style['middle-left']}>
                            <div className={style['image-wrapper']} ref={el => this.cdWrapper = el}>
                                <img src={currentSong.image} alt=""
                                     className={`rotate ${playing ? '' : 'rotate-pause'}`}/>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.bottom} bottom`}>
                        <div className={style['progress-wrapper']}>
                            <div className={style.time}>{formatTime(currentTime)}</div>
                            <div className={style['bar-wrapper']}>
                                <ProgressBar percent={percent} percentChange={this.onPercentChange}/>
                            </div>
                            <div className={style.time}>{formatTime(currentSong.duration / 1000)}</div>
                        </div>
                        <div className={style['control-wrapper']}>
                            <div><span className={`iconfont ${icons[mode]}`} onClick={this.changeMode}/></div>
                            <div><span className={'iconfont icon-shangyishou'} onClick={this.prev}/></div>
                            <div><span className={`iconfont ${playing ? 'icon-bofang2' : 'icon-play_icon'}`}
                                       onClick={this.togglePlay}/></div>
                            <div><span className={'iconfont icon-xiayishou'} onClick={this.next}/></div>
                            <div><span className={`iconfont ${isExist ? 'icon-xihuan1' : 'icon-xihuan'}`}
                                       onClick={() => this.setLikes(isExist)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default NormalPlayer
import React from 'react'
import style from './style/normalPlayer.module.less'
import { inject, observer } from 'mobx-react'
import { CSSTransition } from 'react-transition-group'
import './style/animate.less'
import animations from 'create-keyframe-animation'

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
    render () {
        const {currentSong, isFullScreen} = this.props.appStore
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
                            <div className={style['image-wrapper']} ref={el=>this.cdWrapper=el}>
                                <img src={currentSong.image} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.bottom} bottom`}>
                        <div className={style['progress-wrapper']}></div>
                        <div className={style['control-wrapper']}>
                            <div><span className={'iconfont icon-xunhuanbofang'}/></div>
                            <div><span className={'iconfont icon-shangyishou'}/></div>
                            <div><span className={'iconfont icon-play_icon'}/></div>
                            <div><span className={'iconfont icon-xiayishou'}/></div>
                            <div><span className={'iconfont icon-xihuan'}/></div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default NormalPlayer
import React from 'react'
import style from './style/miniPlayer.module.less'
import { inject, observer } from 'mobx-react'
import './style/animate.less'
import ProgressCircle from '@/components/ProgressCircle'

@inject('appStore') @observer
class MiniPlayer extends React.Component {

    open = () => {
        this.props.appStore.setFullScreen(true)
    }
    togglePlay = (e) => {
        e.stopPropagation()
        this.props.appStore.togglePlay()
    }
    showPlaylist = (e) => {
        e.stopPropagation()
        this.props.appStore.setStore({
            isShowPlaylist: true
        })
    }

    render () {
        const {currentSong, playing, percent} = this.props.appStore
        return (
            <div className={style['mini-player']} onClick={this.open}>
                <div className={style.icon}>
                    <img src={currentSong.image} alt="" className={`rotate ${playing ? '' : 'rotate-pause'}`}/>
                </div>
                <div className={style.text}>
                    <h2>{currentSong.name}</h2>
                    <p>{currentSong.artists}</p>
                </div>
                <div className={style.control} onClick={this.togglePlay}>
                    <ProgressCircle percent={percent} radius={32}>
                        <span className={`iconfont ${style.iconfont} ${playing ? 'icon-iconstop' : 'icon-icon--1'}`}/>
                    </ProgressCircle>
                </div>
                <div className={style.control} onClick={this.showPlaylist}>
                    <span className={`iconfont icon-liebiao3 ${style.iconfont2}`}/>
                </div>
            </div>
        )
    }
}

export default MiniPlayer
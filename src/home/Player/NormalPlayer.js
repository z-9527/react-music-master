import React from 'react'
import style from './style/normalPlayer.module.less'
import { inject, observer } from 'mobx-react'

@inject('appStore') @observer
class NormalPlayer extends React.Component {
    close = () => {
        this.props.appStore.setFullScreen(false)
    }

    render () {
        const {currentSong} = this.props.appStore
        return (
            <div className={style['normal-player']}>
                <div className={style.background}>
                    <img src={currentSong.image}/>
                </div>
                <div className={style.top}>
                    <div className={style.back} onClick={this.close}>
                        <span className={'iconfont icon-jiantouarrow483'}/>
                    </div>
                    <h2>{currentSong.name}</h2>
                    <h3>{currentSong.artists}</h3>
                </div>
                <div className={style.middle}>
                    <div className={style['middle-left']}>
                        <div className={style['image-wrapper']}>
                            <img src={currentSong.image} alt=""/>
                        </div>
                    </div>
                </div>
                <div className={style.bottom}>
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
        )
    }
}

export default NormalPlayer
import React from 'react'
import style from './style/miniPlayer.module.less'
import { inject, observer } from 'mobx-react'

@inject('appStore') @observer
class MiniPlayer extends React.Component {

    open = () => {
        this.props.appStore.setFullScreen(true)
    }

    render () {
        const {currentSong} = this.props.appStore
        return (
            <div className={style['mini-player']} onClick={this.open}>
                <div className={style.icon}>
                    <img src={currentSong.image} alt=""/>
                </div>
                <div className={style.text}>
                    <h2>{currentSong.name}</h2>
                    <p>{currentSong.artists}</p>
                </div>
                <div className={style.control}>

                </div>
                <div className={style.control}>

                </div>
            </div>
        )
    }
}

export default MiniPlayer
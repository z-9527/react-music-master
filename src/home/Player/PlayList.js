import React from 'react'
import style from './style/playlist.module.less'
import { inject, observer } from 'mobx-react'
import Scroll from '@/components/Scroll'

@inject('appStore') @observer
class PlayList extends React.Component {

    changeMode = () => {
        this.props.appStore.changeMode()
    }

    render () {
        const {mode, playlist, currentSong} = this.props.appStore
        const icons = ['icon-xunhuanbofang', 'icon-suijibofang', 'icon-danquxunhuan']
        const texts = ['顺序播放', '随机播放', '单曲循环']
        return (
            <div className={style.wrapper}>
                <div className={style['list-wrapper']}>
                    <div className={style['list-top']}>
                        <div onClick={this.changeMode}>
                            <span className={`iconfont ${icons[mode]} ${style.icon}`}/>
                            <span className={style.text}>{texts[mode]}</span>
                            <span className={style.num}>({playlist.length})</span>
                        </div>
                        <div>
                            <span className={`iconfont icon-lvzhou_shanchu_lajitong ${style.icon}`}/>
                        </div>
                    </div>
                    <div className={style['list-main']}>
                        <Scroll>
                            <ul>
                                {playlist && playlist.map(item => <li key={item.id} className={item.id === currentSong.id ? style.active : ''}>
                                    <div>{item.name}</div>
                                    <div>
                                        <span className={'iconfont icon-xihuan'}/>
                                        <span className={style.remove}>×</span>
                                    </div>
                                </li>)}
                            </ul>
                        </Scroll>
                    </div>
                    <div className={style['list-bottom']}>关闭</div>
                </div>
            </div>
        )
    }
}

export default PlayList
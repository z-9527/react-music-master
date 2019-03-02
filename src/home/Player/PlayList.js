import React from 'react'
import style from './style/playlist.module.less'
import { inject, observer } from 'mobx-react'
import Scroll from '@/components/Scroll'

@inject('appStore') @observer
class PlayList extends React.Component {

    // componentWillReceiveProps生命周期是要淘汰的生命周期，所以少用。prevProps和props的appStore中的currentSong都是一样的，所以手动传进来一个
    componentDidUpdate (prevProps) {
        const currentSong = this.props.currentSong
        const prevCurrentSong = prevProps.currentSong
        const isShowPlaylist = this.props.appStore.isShowPlaylist
        if (isShowPlaylist && currentSong.id !== prevCurrentSong.id) {
            this.scrollCurrent()
        }
    }

    changeMode = () => {
        this.props.appStore.changeMode()
    }
    close = () => {
        this.props.appStore.setStore({
            isShowPlaylist: false
        })
    }
    stop = (e) => {
        e.stopPropagation()
    }
    scrollCurrent = () => {
        const currentIndex = this.props.appStore.currentIndex
        const currentDom = this[`item${currentIndex}`]
        this.scroll && this.scroll.scrollToElement(currentDom, 300)
    }
    selectItem = (index) => {
        this.props.appStore.setStore({
            currentIndex: index
        })
    }
    deleteSong = (index,e) => {
        e.stopPropagation()
        this.props.appStore.deleteSong(index)
    }

    render () {
        const {mode, playlist, isShowPlaylist} = this.props.appStore
        const currentSong = this.props.currentSong
        const icons = ['icon-xunhuanbofang', 'icon-suijibofang', 'icon-danquxunhuan']
        const texts = ['顺序播放', '随机播放', '单曲循环']

        return (
            <div className={style.wrapper} style={{display: isShowPlaylist ? '' : 'none'}} onClick={this.close}>
                <div className={style['list-wrapper']} onClick={this.stop}>
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
                        <Scroll ref={scroll => this.scroll = scroll}>
                            <ul>
                                {playlist && playlist.map((item, index) => <li key={item.id}
                                                                               onClick={() => this.selectItem(index)}
                                                                               ref={li => this[`item${index}`] = li}
                                                                               className={item.id === currentSong.id ? style.active : ''}>
                                    <div>{item.name}</div>
                                    <div>
                                        <span className={'iconfont icon-xihuan'}/>
                                        <span className={style.remove} onClick={(e) => this.deleteSong(index,e)}>×</span>
                                    </div>
                                </li>)}
                            </ul>
                        </Scroll>
                    </div>
                    <div className={style['list-bottom']} onClick={this.close}>关闭</div>
                </div>
            </div>
        )
    }
}

export default PlayList
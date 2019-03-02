import React from 'react'
import style from './style/playlist.module.less'
import { inject, observer } from 'mobx-react'
import Scroll from '@/components/Scroll'
import { Modal } from 'antd-mobile'

const alert = Modal.alert

@inject('appStore') @observer
class PlayList extends React.Component {

    // componentWillReceiveProps生命周期是要淘汰的生命周期，所以少用。prevProps和props的appStore中的属性都是一样的，所以手动传入
    componentDidUpdate (prevProps) {
        const {currentSong, isShowPlaylist} = this.props
        const {currentSong: prevCurrentSong, isShowPlaylist: prevIsShow} = prevProps
        //当currentSong变化或者刚打开playlist组件时调用
        if (currentSong.id !== prevCurrentSong.id || isShowPlaylist !== prevIsShow) {
            this.scrollToCurrent()
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
    scrollToCurrent = () => {
        const currentIndex = this.props.appStore.currentIndex
        const currentDom = this[`item${currentIndex}`]
        this.scroll && this.scroll.scrollToElement(currentDom, 300)
    }
    selectItem = (index) => {
        this.props.appStore.setStore({
            currentIndex: index
        })
    }
    deleteSong = (index, e) => {
        e.stopPropagation()
        this.props.appStore.deleteSong(index)
    }
    setLikes = (item, e) => {
        e.stopPropagation()
        this.props.appStore.setLikes(item)
    }
    clear = () => {
        alert('提示', '确定清空播放列表吗?', [
            {text: '取消',},
            {text:'确定',onPress:()=>{
                this.props.appStore.setStore({
                    playlist: [],
                    currentIndex: -1,
                    isShowPlaylist:false
                })
            }}
        ])
    }
    render () {
        const {mode, playlist, isShowPlaylist, likeSongs} = this.props.appStore
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
                        <div onClick={this.clear}>
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
                                        <span
                                            className={`iconfont ${likeSongs.some(i => i.id === item.id) ? 'icon-xihuan1' : 'icon-xihuan'}`}
                                            onClick={(e) => this.setLikes(item, e)}/>
                                        <span className={style.remove}
                                              onClick={(e) => this.deleteSong(index, e)}>×</span>
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
import { observable, action, computed, runInAction } from 'mobx'
import { get } from '@/utils/ajax'
import { Toast } from 'antd-mobile'

const mode = {
    sequence: 0, //顺序播放
    shuffle: 1,  //随机播放
    loop: 2      //单曲循环
}

class AppStore {
    @observable isExpandSider //侧边栏是否展开
    @observable playing    //歌曲是否正在播放
    @observable playlist   //播放列表
    @observable mode   //播放模式
    @observable currentIndex   //当前播放歌曲索引
    @observable isFullScreen   //是否全屏播放音乐
    @observable likeSongs   //喜欢的音乐列表

    constructor () {
        this.isExpandSider = false
        this.playing = false
        this.playlist = []
        this.mode = mode.sequence
        this.currentIndex = -1
        this.isFullScreen = false
        this.likeSongs = JSON.parse(localStorage.getItem('likeSongs')) || []
    }

    /**
     * 获取当前播放歌曲，并对数据进行处理
     * @returns {*|{}}
     */
    @computed
    get currentSong () {
        let song = this.playlist[this.currentIndex] || {}
        if (song.name) {
            song.artists = song.ar.map(item => item.name).join('/')
            song.image = song.al ? song.al.picUrl : ''
        }
        return song
    }

    /**
     * 切换侧边栏的折叠展开
     */
    @action
    toggleExpand = () => {
        this.isExpandSider = !this.isExpandSider
    }
    /**
     * 设置是否全屏播放音乐
     * @param flag
     */
    @action
    setFullScreen = (flag) => {
        this.isFullScreen = flag
    }
    /**
     * 选择播放歌曲,设置播放列表
     * @param obj
     * @returns {Promise.<void>}
     */
    @action
    onSelectSong = async (obj) => {
        const {songlist, index} = obj
        this.playlist = songlist || []
        this.currentIndex = index
        this.isFullScreen = true
        this.playing = true
    }
    /**
     * 暂停/播放音乐
     */
    @action
    togglePlay = () => {
        this.playing = !this.playing
    }
    /**
     * 设置喜欢的音乐
     * @param isAdd   是否是添加音乐
     * @param song    喜欢的音乐
     * @param index   索引
     */
    @action
    setLikes = ({isAdd, song, index}) => {
        let likeSongs = this.likeSongs.slice()
        if (isAdd) {
            likeSongs.unshift(song)
        } else {
            index = index || likeSongs.findIndex(item => item.id === song.id)
            likeSongs.splice(index,1)
        }
        localStorage.setItem('likeSongs',JSON.stringify(likeSongs))
        this.likeSongs = JSON.parse(localStorage.getItem('likeSongs')) || []
    }

}

export default new AppStore()
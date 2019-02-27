import { observable, action, computed, runInAction, reaction } from 'mobx'
import { get } from '@/utils/ajax'
import { Toast } from 'antd-mobile'
import { getRandom } from '@/utils/util'

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
    @observable playHistorys   //播放历史
    @observable audio   //audio
    @observable songReady   //歌曲是否已经准备好了播放

    constructor () {
        this.isExpandSider = false
        this.playing = false
        this.playlist = []
        this.mode = mode.sequence
        this.currentIndex = -1
        this.isFullScreen = false
        this.likeSongs = JSON.parse(localStorage.getItem('likeSongs')) || []
        this.playHistorys = JSON.parse(localStorage.getItem('playHistorys')) || []
        this.audio = null
        this.songReady = false

        //当currentSong变化时作出反应
        reaction(() => this.currentSong, () => {
            this.currentSongChange()
        })
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
            song.url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`
            song.duration = song.dt || song.duration || 0
        }
        return song
    }

    @action
    setStore = (obj) => {
        if (Object.prototype.toString.call(obj) !== '[object Object]') {
            return
        }
        for (let [key, value] of Object.entries(obj)) {
            this[key] = value
        }
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
    }
    /**
     * 当current变化时的处理
     * @returns {Promise.<void>}
     */
    @action
    currentSongChange = () => {
        this.playing = true
        setTimeout(() => {
            this.audio && this.audio.play()
        })
    }
    /**
     * 切换播放模式
     */
    changeMode = () => {
        let mode = (this.mode + 1) % 3
        const infos = ['顺序播放', '随机播放', '单曲循环']
        Toast.info(infos[mode], 1, null, false)
        this.mode = mode
    }
    /**
     * 切歌，实际上就是维护的currentIndex
     * @param direction 上一首（prev） 下一首（next）
     */
    changeSong = (direction) => {
        let currentIndex = this.currentIndex
        if (!this.songReady) {
            return
        }

        if (this.mode = mode.shuffle) {
            currentIndex = getRandom(0, this.playlist.length - 1)
            while (currentIndex === this.currentIndex) {
                currentIndex = getRandom(0, this.playlist.length - 1)
            }
        } else {
            if (direction === 'prev') {
                currentIndex--
                if (currentIndex === -1) {
                    currentIndex = this.playlist.length - 1
                }
            }
            if (direction === 'next') {
                currentIndex++
                if (currentIndex === this.playlist.length) {
                    currentIndex = 0
                }
            }
        }
        this.currentIndex = currentIndex
        this.songReady = false
    }
    /**
     * 暂停/播放音乐
     */
    @action
    togglePlay = () => {
        clearTimeout(this.errorTimer)
        if (this.playing) {
            this.audio && this.audio.pause()
        } else {
            this.audio && this.audio.play()
        }
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
            likeSongs.splice(index, 1)
        }
        localStorage.setItem('likeSongs', JSON.stringify(likeSongs))
        this.likeSongs = JSON.parse(localStorage.getItem('likeSongs')) || []
    }
    /**
     * 设置播放历史
     * @param isAdd 是否是添加音乐
     * @param song  音乐
     * @param index 索引
     */
    @action
    setPlayHistorys = ({isAdd, song, index}) => {
        let playHistorys = this.playHistorys.slice()
        if (isAdd) {
            let exist = playHistorys.findIndex(item => item.id === song.id)
            if (exist !== -1) {
                playHistorys.splice(exist, 1)
            }
            playHistorys.unshift(song)
        } else {
            index = index || playHistorys.findIndex(item => item.id === song.id)
            playHistorys.splice(index, 1)
        }
        localStorage.setItem('playHistorys', JSON.stringify(playHistorys))
    }

    /**------------------------------------**/
    /**
     * 当歌曲准备好的处理
     */
    @action
    onCanPlay = () => {
        this.songReady = true
        this.setPlayHistorys({
            isAdd: true,
            song: this.currentSong
        })
    }

    /**
     * 播放错误时的处理
     */
    @action
    onError = () => {
        Toast.info('播放错误，自动跳到下一首', 2, null, false)
        this.errorTimer = setTimeout(() => {
            this.changeSong('next')
        }, 2000)
    }
    /**
     * 当歌曲播放结束后的处理
     */
    @action
    onEnded = () => {
        if(this.mode = mode.loop){

        } else {
            this.changeSong('next')
        }
    }

}

export default new AppStore()
import {observable, action, computed, runInAction, reaction} from 'mobx'
import {get} from '@/utils/ajax'
import {Toast} from 'antd-mobile'
import {getRandom} from '@/utils/util'
import Lyric from 'lyric-parser'

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
    @observable currentTime   //歌曲播放的时间
    @observable isShowPlaylist   //是否显示播放列表
    @observable lyric   //歌词
    @observable playingLyric   //正在播放的歌词
    @observable playingLineNum   //正在播放的歌词行数

    constructor() {
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
        this.currentTime = 0
        this.isShowPlaylist = false
        this.lyric = null
        this.playingLyric = ''
        this.playingLineNum = 0

        //当currentSong变化时作出反应
        reaction(() => this.currentSong, () => {
            this.currentSongChange()
        })
    }

    /**
     * 获取当前播放歌曲，并对数据进行处理
     * @returns {*|{}}
     */
    // 当playlist，currentIndex变化时，reaction就会触发，所以要对前后的变化进行判断是否是同一首歌
    @computed({equals: (prevSong, newSong) => prevSong.id === newSong.id})
    get currentSong() {
        let song = {}
        if (this.playlist[this.currentIndex]) {
            //引用类型的赋值一定要注意，这里必须深拷贝，否则song的改变会改变this.playlist，this.playlist的改变又触发计算属性，最后导致报错
            song = {...this.playlist[this.currentIndex]}
            song.artists = song.ar.map(item => item.name).join('/')
            song.image = song.al ? song.al.picUrl : ''
            song.url = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`
            song.duration = (song.dt / 1000) || (song.duration) / 1000 || 0
        }
        return song
    }

    /**
     * 获取播放时间的百分比
     * @returns {number}
     */
    @computed
    get percent() {
        if (this.currentSong.duration) {
            return this.currentTime / this.currentSong.duration
        } else {
            return 0
        }
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
        this.playlist = songlist ? songlist.slice() : []
        this.currentIndex = index
        this.isFullScreen = true
    }
    /**
     * 当current变化时的处理
     * @returns {Promise.<void>}
     */
    @action
    currentSongChange = () => {
        if (!this.currentSong.id) {
            return
        }
        this.lyric && this.lyric.stop()
        this.playing = true
        this.currentTime = 0
        this.playingLineNum = 0
        this.playingLyric = ''
        this.lyric = null
        setTimeout(() => {
            this.audio && this.audio.play()
            this.getLyric(this.currentSong.id)
        })
    }
    /**
     * 获取歌曲歌词
     * @param id
     * @returns {Promise.<void>}
     */
    @action
    getLyric = async (id)=>{
        const res = await get(`/lyric?id=${id}`)
        runInAction(()=>{
            this.lyric = res.lrc ? new Lyric(res.lrc.lyric, this.handler) : null
            this.lyric && this.lyric.play()
        })
    }
    /**
     * 播放的歌词变化时的处理
     * @param lineNum  播放的行数
     * @param txt    当前播放歌词
     */
    @action
    handler = ({lineNum, txt})=>{
        this.playingLyric = txt
        this.playingLineNum = lineNum
    }
    /**
     * 切换播放模式
     */
    @action
    changeMode = () => {
        let mode = (this.mode + 1) % 3
        const infos = ['顺序播放', '随机播放', '单曲循环']
        Toast.info(infos[mode], 1, null, false)
        this.mode = mode
    }
    /**
     * 循环播放
     */
    @action
    loop = () => {
        this.audio.currentTime = 0
        this.audio.play()
        this.playing = true
        this.lyric && this.lyric.seek(0)
    }
    /**
     * 切歌，实际上就是维护的currentIndex
     * @param direction 上一首（prev） 下一首（next）
     */
    @action
    changeSong = (direction) => {
        let currentIndex = this.currentIndex
        if (!this.songReady) {
            return
        }
        if (this.playlist.length === 1) {
            this.loop()
            return
        }

        if (this.mode === mode.shuffle) {
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
        this.lyric && this.lyric.togglePlay()
        this.playing = !this.playing
    }
    /**
     * 设置喜欢的音乐
     * @param isAdd   是否是添加音乐
     * @param song    喜欢的音乐
     * @param index   索引
     */
    @action
    setLikes = (song) => {
        let likeSongs = this.likeSongs.slice()
        const findx = likeSongs.findIndex(item => item.id === song.id)
        if (findx !== -1) {
            likeSongs.splice(findx, 1)
        } else {
            likeSongs.unshift(song)
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
            playHistorys.splice(index, 1)
        }
        localStorage.setItem('playHistorys', JSON.stringify(playHistorys))
        this.playHistorys = JSON.parse(localStorage.getItem('playHistorys')) || []
    }
    /**
     * 删除播放列表中的歌曲
     * @param index
     */
    @action
    deleteSong = (index) => {
        let playlist = this.playlist.slice()
        let currentIndex = this.currentIndex
        playlist.splice(index, 1)
        if (currentIndex > index || currentIndex === playlist.length) {
            currentIndex--
        }
        if (playlist.length === 0) {
            this.isShowPlaylist = false
        }
        this.playlist = playlist
        this.currentIndex = currentIndex
    }
    /**
     * 添加歌曲到播放列表中
     * @param song
     */
    @action
    addSong = (song) => {
        let playlist = this.playlist.slice()
        let currentIndex = this.currentIndex
        const findex = playlist.findIndex(item => item.id === song.id)
        if (findex !== -1) {
            this.currentIndex = findex
            return
        }
        currentIndex++
        playlist.splice(currentIndex, 0, song)
        this.playlist = playlist
        this.currentIndex = currentIndex
        this.isFullScreen = true
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
        if (this.mode === mode.loop) {
            this.loop()
        } else {
            this.changeSong('next')
        }
    }
    /**
     * 播放时间更新时的处理
     * @param e
     */
    @action
    onTimeUpdate = (e) => {
        this.currentTime = e.target.currentTime
    }
    /**
     * 当播放百分比变化的处理
     * @param percent
     */
    onPercentChange = (percent) => {
        const currentTime = percent * this.currentSong.duration
        this.audio.currentTime = currentTime
        this.lyric && this.lyric.seek(currentTime * 1000)
    }

}

export default new AppStore()
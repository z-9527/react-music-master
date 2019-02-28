import React from 'react'
import {withRouter} from 'react-router-dom'
import style from './style/index.module.less'
import {get} from '@/utils/ajax'
import NavBar from '@/components/NavBar'
import {Tabs} from 'antd-mobile'
import HeaderInfo from '@/components/HeaderInfo'
import Loading from '../../components/Loading/index'
import SongList from '@/components/SongList'
import Scroll from '@/components/Scroll'
import {createMarkup} from '@/utils/util'
import {inject,observer} from 'mobx-react'


@withRouter @inject('appStore') @observer
class AlbumPage extends React.Component{
    state = {
        info:{},   //专辑信息
        songs:[],   //歌曲
        loading:false //页面loading
    }

    componentDidMount(){
        const id = this.props.match.params.id
        this.getDetail(id)
    }
    getDetail = async (id)=>{
        this.setState({
            loading:true
        })
        const res = await get(`/album?id=${id}`)
        const album = res.album || {}

        const info = {
            coverImgUrl:album.blurPicUrl,
            description:album.description,
            name:album.name,
            updateTime:album.publishTime,
            creator:{
                nickname:album.artist && album.artist.name,
                avatarUrl:album.artist && album.artist.picUrl,
            }
        }
        this.setState({
            info:info,
            songs:res.songs || [],
            loading:false
        })
    }
    onSelectSong = (obj)=>{
        this.props.appStore.onSelectSong(obj)
    }

    render(){
        const {info,songs,loading} = this.state
        const {currentSong,playlist} = this.props.appStore

        const tabs = [
            {title:'歌曲'},
            {title:'专辑简介'},
        ]

        const h = playlist.length ? 60 : 0
        const height = {height:`calc(100vh - ${ 300 + h}px`}

        return (
            <div className={style.container}>
                <NavBar>专辑</NavBar>
                <HeaderInfo info={info}/>
                <div>
                    <Tabs tabs={tabs} swipeable={false}>
                        <div style={height}>
                            <SongList list={songs} onSelectSong={this.onSelectSong} currentSong={currentSong}/>
                            <Loading loading={loading}/>
                        </div>
                        <div style={height}>
                            <Scroll>
                                <div className={style.description} dangerouslySetInnerHTML={createMarkup(info.description)}/>
                            </Scroll>
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default AlbumPage
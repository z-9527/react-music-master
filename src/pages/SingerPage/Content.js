import React from 'react'
import {Tabs} from 'antd-mobile'
import style from './style/content.module.less'
import {withRouter} from 'react-router-dom'
import {get} from '@/utils/ajax'
import SongList from '@/components/SongList'
import Loading from '@/components/Loading'
import {createMarkup} from '@/utils/util'
import Scroll from '@/components/Scroll'
import dayjs from 'dayjs'
import {formatNumber} from '@/utils/util'
import {inject,observer} from 'mobx-react'

@withRouter @inject('appStore') @observer
class Content extends React.Component{
    state = {
        id:'', //歌手ID
        songs: [], //歌手单曲
        songsLoading: false, //获取单曲的loading
        albums: [], //歌手专辑
        albumsLoading:false , //获取专辑的loading
        mvs: [], //歌手mv
        mvsLoading:false,//获取mv的loading
        info:{},  //歌手信息
        infoLoading:false //获取信息的loading
    }
    componentDidMount(){
        const id = this.props.match.params.id
        this.setState({
            id
        })
        this.getSongs(id)
    }
    getSongs = async (id)=>{
        // 有数据就不再去请求
        if(this.state.songs.length){
            return
        }
        this.setState({
            songsLoading:true
        })
        const res = await get(`/artists?id=${id}`)
        this.setState({
            songsLoading:false,
            songs:res.hotSongs || []
        })
    }
    getAlbums = async (id)=>{
        if(this.state.albums.length){
            return
        }
        this.setState({
            albumsLoading:true
        })
        const res = await get(`/artist/album?id=${id}`)
        this.setState({
            albumsLoading:false,
            albums:res.hotAlbums || []
        })
    }
    getMvs = async (id)=>{
        if(this.state.mvs.length){
            return
        }
        this.setState({
            mvsLoading:true
        })
        const res = await get(`/artist/mv?id=${id}`)
        this.setState({
            mvsLoading:false,
            mvs:res.mvs || []
        })
    }
    getInfo = async (id)=>{
        if(this.state.info.briefDesc){
            return
        }
        this.setState({
            infoLoading:true
        })
        const res = await get(`/artist/desc?id=${id}`)
        this.setState({
            infoLoading:false,
            info:res
        })
    }
    handleChange = (tab,index)=>{
        const id = this.state.id
        switch (index){
            case 0:{
                this.getSongs(id)
                break;
            }
            case 1:{
                this.getAlbums(id)
                break;
            }
            case 2:{
                this.getMvs(id)
                break;
            }
            case 3:{
                this.getInfo(id)
                break;
            }
            default :{
                this.getSongs(id)
            }
        }
    }
    goTo = (url)=>{
        this.props.history.push(url)
    }
    onSelectSong = (obj)=>{
        this.props.appStore.onSelectSong(obj)
    }

    render(){
        const {songs,songsLoading,albums,albumsLoading,mvs,mvsLoading,info,infoLoading} = this.state
        const {currentSong,playlist} = this.props.appStore
        const tabs = [
            {title:'单曲'},
            {title:'专辑'},
            {title:'MV'},
            {title:'简介'},
        ]
        const h = playlist.length ? 60 : 0
        const height = {height:`calc(100vh - ${ 88 + h}px`}
        return (
            <div className={style.wrapper}>
                <Tabs tabs={tabs} swipeable={false} onChange={this.handleChange} initialPage={0}>
                    {/*单曲*/}
                    <div className={style['tab-item']} style={height}>
                        <SongList list={songs} onSelectSong={this.onSelectSong} currentSong={currentSong}/>
                        <Loading loading={songsLoading} style={{position:'absolute',top:'30%'}}/>
                    </div>
                    {/*专辑*/}
                    <div className={style['tab-item']} style={height}>
                        <Scroll>
                            <ul className={style.albums}>
                                {
                                    albums && albums.map(item=><li key={item.id} onClick={()=>this.goTo(`/album/${item.id}`)}>
                                        <div className={style.left}>
                                            <img src={item.picUrl} alt=""/>
                                        </div>
                                        <div className={style.right}>
                                            <div className={style.title}>{item.name}</div>
                                            <div>{dayjs(item.publishTime).format('YYYY-MM-DD')} 歌曲{item.size}</div>
                                        </div>
                                    </li>)
                                }
                            </ul>
                        </Scroll>
                        <Loading loading={albumsLoading} style={{position:'absolute',top:'30%'}}/>
                    </div>
                    {/*MV*/}
                    <div className={style['tab-item']} style={height}>
                        <Scroll>
                            <ul className={style.mvs}>
                                {
                                    mvs && mvs.map(item=><li key={item.id} onClick={()=>this.goTo(`/mv/${item.id}`)}>
                                        <div className={style.left}>
                                            <img src={item.imgurl16v9} alt="" style={{width:120}}/>
                                            <p className={style.playCount}><span className={'iconfont icon-bofang1'} style={{fontSize:12}}/> {formatNumber(item.playCount)}</p>
                                        </div>
                                        <div className={style.right}>
                                            <div className={style.title}>{item.name}</div>
                                            <div>{dayjs(item.publishTime).format('YYYY-MM-DD')}</div>
                                        </div>
                                    </li>)
                                }
                            </ul>
                        </Scroll>
                        <Loading loading={mvsLoading} style={{position:'absolute',top:'30%'}}/>
                    </div>
                    {/*简介*/}
                    <div className={style['tab-item']} style={height}>
                        <Scroll>
                            <div className={style['info-box']}>
                                <div style={{display:info.briefDesc?'':'none'}}>
                                    <div className={style.title}>简介</div>
                                    <div className={style.text} dangerouslySetInnerHTML={createMarkup(info.briefDesc)}/>
                                </div>
                                {
                                    info.introduction && info.introduction.map(item=><div key={item.ti}>
                                        <div className={style.title}>{item.ti}</div>
                                        <div className={style.text} dangerouslySetInnerHTML={createMarkup(item.txt)}/>
                                    </div>)
                                }

                            </div>
                        </Scroll>
                        <Loading loading={infoLoading} style={{position:'absolute',top:'30%'}}/>
                    </div>
                </Tabs>
            </div>
        )
    }
}

export default Content
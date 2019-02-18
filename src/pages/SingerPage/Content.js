import React from 'react'
import {Tabs} from 'antd-mobile'
import style from './style/content.module.less'
import {withRouter} from 'react-router-dom'
import {get} from '@/utils/ajax'
import SongList from '@/components/SongList'
import Loading from '@/components/Loading'
import {createMarkup} from '@/utils/util'
import Scroll from '@/components/Scroll'

@withRouter
class Content extends React.Component{
    state = {
        id:'', //歌手ID
        songs: [], //歌手单曲
        songsLoading: false, //获取单曲的loading
        albums: [], //歌手专辑
        mvs: [], //歌手mv
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
            case 3:{
                this.getInfo(id)
                break;
            }
        }
    }

    render(){
        const {songs,songsLoading,info,infoLoading} = this.state
        const tabs = [
            {title:'单曲'},
            {title:'专辑'},
            {title:'MV'},
            {title:'简介'},
        ]
        const height = {height:'calc(100vh - 88px)'}
        return (
            <div className={style.wrapper}>
                <Tabs tabs={tabs} swipeable={false} onChange={this.handleChange} initialPage={0}>
                    {/*单曲*/}
                    <div className={style['tab-item']} style={height}>
                        <SongList list={songs}/>
                        <Loading loading={songsLoading} style={{position:'absolute',top:'30%'}}/>
                    </div>
                    {/*专辑*/}
                    <div>专辑</div>
                    {/*MV*/}
                    <div>MV</div>
                    {/*简介*/}
                    <div className={style['tab-item']} style={height}>
                        <Scroll>
                            <div className={style['info-box']}>
                                <div style={{display:info.briefDesc?'':'none'}}>
                                    <div className={style.title}>简介</div>
                                    <div dangerouslySetInnerHTML={createMarkup(info.briefDesc)} style={{marginBottom:20}}/>
                                </div>
                                {
                                    info.introduction && info.introduction.map(item=><div key={item.ti}>
                                        <div className={style.title}>{item.ti}</div>
                                        <div dangerouslySetInnerHTML={createMarkup(item.txt)} style={{marginBottom:20}}/>
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
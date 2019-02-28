import React from 'react'
import {Tabs} from 'antd-mobile'
import style from './style/content.module.less'
import Scroll from '@/components/Scroll'
import SongList from '@/components/SongList'
import PropTypes from 'prop-types'
import {createMarkup} from '@/utils/util'
import Loading from '@/components/Loading'
import {inject,observer} from 'mobx-react'


@inject('appStore') @observer
class Content extends React.Component{
    static propTypes = {
        info: PropTypes.object,
    }
    static defaultProps = {
        info:{}
    }
    state = {
        songs:[],
        loading:false   //分页加载的loading
    }

    //外部的info是异步获取的，所以这里用此生命周期而不用componentDidMount
    componentDidUpdate(prevProps){
        const info = this.props.info
        if (info !== prevProps.info) {
            this.setState({
                songs: info.tracks ? info.tracks.slice(0,30) : [] //避免第一次的延迟，
            })
        }
    }
    //数据已经全部返回，所以这里模拟数据请求和分页
    getSongs = (size=0)=>{
        const {info} = this.props
        const allList = info.tracks ? info.tracks.slice() : []

        if(this.state.songs.length >= allList.length){
            return
        }

        this.setState({
            loading: true
        })

        let list = []
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(()=>{
             list = allList.slice(size,size + 30)
            this.setState({
                songs:this.state.songs.concat(list),
                loading:false
            })
        },2000)
    }
    loadingMore = ()=>{
        if(this.state.loading){
            return
        }
        const size = this.state.songs.length
        this.getSongs(size)
    }
    onSelectSong = (obj)=>{
        this.props.appStore.onSelectSong(obj)
    }

    render(){
        const {info} = this.props
        const {songs,loading} = this.state
        const {currentSong,playlist} = this.props.appStore

        const tabs = [
            { title:'歌曲'},
            { title:'详情'}
        ]
        const h = playlist.length ? 60 : 0
        const height = {height:`calc(100vh - ${ 300 + h}px`}

        return (
           <div>
               <Tabs tabs={tabs} swipeable={false}>
                   <div style={height}>
                       <SongList list={songs} loading={loading} loadingMore={this.loadingMore} onSelectSong={this.onSelectSong} currentSong={currentSong}/>
                       <Loading loading={this.props.loading}/>
                   </div>
                   <div style={height}>
                       <Scroll>
                           <div className={style.description} dangerouslySetInnerHTML={createMarkup(info.description)}/>
                       </Scroll>
                   </div>
               </Tabs>
           </div>
        )
    }
}

export default Content
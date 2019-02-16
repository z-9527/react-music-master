import React from 'react'
import {Tabs} from 'antd-mobile'
import style from './style/content.module.less'
import Scroll from '@/components/Scroll'
import SongList from '@/components/SongList'
import PropTypes from 'prop-types'



function createMarkup(description) {
    if(description){
        description = description.replace(/(\r\n|\n|\r)/gm, "<br />")
        return {__html: description};
    }
}


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
        if (this.props.info !== prevProps.info) {
            this.setState({
                songs: this.props.info.tracks.slice(0,30) //避免第一次的延迟，
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
        //模拟两秒的网络延迟
        setTimeout(()=>{
             list = allList.slice(size,size + 30)
            this.setState({
                songs:this.state.songs.concat(list),
                loading:false
            })
        },3000)
    }
    loadingMore = ()=>{
        if(this.state.loading){
            return
        }
        const size = this.state.songs.length
        this.getSongs(size)
    }

    render(){
        const {info} = this.props
        const {songs,loading} = this.state

        const tabs = [
            { title:'歌曲'},
            { title:'详情'}
        ]

        return (
           <div>
               <Tabs tabs={tabs} swipeable={false}>
                   <div style={{height:'calc(100vh - 300px)'}}>
                       <SongList list={songs} loading={loading} loadingMore={this.loadingMore}/>
                   </div>
                   <div style={{height:'calc(100vh - 300px)'}}>
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
import React from 'react'
import style from './style/index.module.less'
import {get} from '@/utils/ajax'
import {withRouter} from 'react-router-dom'
import 'video-react/dist/video-react.css';
import { Player,BigPlayButton } from 'video-react';
import {formatNumber,createMarkup} from '@/utils/util'
import dayjs from 'dayjs'
import Scroll from '../../components/Scroll/index'
import Loading from '@/components/Loading'

@withRouter
class MVPage extends React.Component{
    state = {
        mvData:{},  //mv数据
        comments:[], //mv评论
        hotComments:[], //热门评论
        total:0, //所有评论
        isLoadMore:false, //是否正在"加载更多"
        loading:false //页面loading
    }
    componentDidMount(){
        this.initPage()
    }
    initPage = ()=>{
        this.setState({
            loading:true
        })
        const id = this.props.match.params.id
        Promise.all([
            this.getMvData(id),
            this.getComments(id)
        ]).then(()=>{
            this.setState({
                loading:false
            })
        })
    }
    getMvData = async (id)=>{
        const res = await get(`/mv/detail?mvid=${id}`)
        this.setState({
            mvData:res.data || {}
        })
    }
    goBack = ()=>{
        this.props.history.goBack()
    }
    getComments = async (id)=>{
        const res = await get(`/comment/mv?id=${id}`)
        this.setState({
            comments:res.comments || [],
            hotComments:res.hotComments || [],
            total:res.total || 0
        })
    }
    onLoadMore = async()=>{
        if(this.state.isLoadMore){
            return
        }
        this.setState({
            isLoadMore:true
        })
        const id = this.props.match.params.id
        const res = await get(`/comment/mv`,{
            id,
            offset:this.state.comments.length
        })
        this.setState({
            isLoadMore:false,
            comments:this.state.comments.concat(res.comments || [])
        })
        this.scroll && this.scroll.finishPullUp()
    }
    render(){
        const {mvData,hotComments,comments,total,isLoadMore,loading} = this.state
        return (
            <div className={style.container}>
                <div className={style.navbar}>
                    <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={this.goBack}/>
                    <div className={style.title}>MV</div>
                </div>
                <div>
                    <Player src={mvData.brs && mvData.brs[240]} poster={mvData.cover}>
                        <BigPlayButton position="center" />
                    </Player>
                </div>
                <div style={{height:'calc(100vh - 256px)',display:loading?'none':''}}>
                    <Scroll onPullingUp={this.onLoadMore} ref={el=>this.scroll=el}>
                        <div>
                            <div className={style.content}>
                                <div className={style.title}>{mvData.name}</div>
                                <div style={{color:'#555'}}>发布：{mvData.publishTime} &nbsp; | &nbsp; 播放：{formatNumber(mvData.playCount)}</div>
                                <div dangerouslySetInnerHTML={createMarkup(mvData.desc)} className={style.desc}/>
                            </div>
                            <div className={style['comment-section']}>
                                <div className={style.title}>精彩评论</div>
                                <ul>
                                    {hotComments && hotComments.map(item=><li key={item.commentId}>
                                        <div className={style.left}>
                                            <img src={item.user && item.user.avatarUrl} alt=""/>
                                        </div>
                                        <div className={style.right}>
                                            <div className={style['user-box']}>
                                                <div>{item.user && item.user.nickname}</div>
                                                <div>{item.likedCount} <span className={'iconfont icon-zan1'}/></div>
                                            </div>
                                            <div className={style.time}>{dayjs(item.time).format('M[月]D[日]')}</div>
                                            <div className={style.comment}>{item.content}</div>
                                        </div>
                                    </li>)}
                                </ul>
                            </div>
                            <div className={style['comment-section']}>
                                <div className={style.title}>最新评论({total})</div>
                                <ul>
                                    {comments && comments.map(item=><li key={item.commentId}>
                                        <div className={style.left}>
                                            <img src={item.user && item.user.avatarUrl} alt=""/>
                                        </div>
                                        <div className={style.right}>
                                            <div className={style['user-box']}>
                                                <div>{item.user && item.user.nickname}</div>
                                                <div>{item.likedCount ? item.likedCount : null} <span className={'iconfont icon-zan1'}/></div>
                                            </div>
                                            <div className={style.time}>{dayjs(item.time).format('M[月]D[日]')}</div>
                                            <div className={style.comment}>{item.content}</div>
                                        </div>
                                    </li>)}
                                </ul>
                                <div className={style.loading} style={{display:isLoadMore?'':'none'}}>加载中...</div>
                            </div>
                        </div>
                    </Scroll>
                </div>
                <Loading loading={loading} style={{top:'60%'}}/>
            </div>
        )
    }
}

export default MVPage
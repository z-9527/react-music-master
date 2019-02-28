import React from 'react'
import style from './style/index.module.less'
import {get} from '@/utils/ajax'
import {withRouter,Link} from 'react-router-dom'
import Scroll from '../../components/Scroll/index'
import Loading from '@/components/Loading'
import {inject,observer} from 'mobx-react'

@withRouter @inject('appStore') @observer
class ArtistsPage extends React.Component{
    state = {
        artists:[],
        loading:false,
        isLoadMore:false, //是否正在'加载更多'
        haveMore:true //数据是否还有
    }

    componentDidMount(){
        this.getArtists()
    }
    getArtists = async ()=>{
        this.setState({
            loading:true
        })
        const res = await get('/top/artists',{
            limit:30
        })
        this.setState({
            loading:false,
            artists:res.artists || [],
            haveMore:res.more
        })
    }
    goBack = ()=>{
        this.props.history.goBack()
    }
    onLoadMore = async ()=>{
        if(!this.state.haveMore || this.state.isLoadMore){
            return
        }
        this.setState({
            isLoadMore:true
        })
        const res = await get('/top/artists',{
            limit:30,
            offset:this.state.artists.length
        })
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(()=>{
            this.setState({
                artists:this.state.artists.concat(res.artists || []),
                isLoadMore:false,
                haveMore:res.more
            })
            this.scroll && this.scroll.finishPullUp()
        },2000)
    }

    render(){
        const {artists,loading,isLoadMore,haveMore} = this.state
        const {playlist} = this.props.appStore

        const h = playlist.length ? 60 : 0
        const height = {height:`calc(100vh - ${ 44 + h}px`}

        return (
            <div className={style.container}>
                <div className={style.navbar}>
                    <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={this.goBack}/>
                    <div className={style.title}>热门歌手</div>
                </div>
                <div style={height}>
                    <Scroll onPullingUp={this.onLoadMore} ref={el=>this.scroll=el}>
                        <div>
                            <ul>
                                {artists && artists.map(item=><li key={item.id}>
                                    <Link to={`/singer/${item.id}`}>
                                        <div className={style['singer-item']}>
                                            <div className={style.avatar}>
                                                <img src={item.img1v1Url} alt=""/>
                                            </div>
                                            <div>
                                                <div className={style.name}>{item.name}</div>
                                                <div>
                                                    <span style={{display:item.albumSize?'':'none'}}>专辑:{item.albumSize}</span>&emsp;
                                                    <span style={{display:item.musicSize?'':'none'}}>单曲:{item.musicSize}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </li>)}
                            </ul>
                            <div className={style.loading} style={{display:isLoadMore?'':'none'}}>加载中...</div>
                            <div className={style.loading} style={{display:haveMore?'none':''}}>加载完毕</div>
                        </div>
                    </Scroll>
                </div>
                <Loading loading={loading}/>
            </div>
        )
    }
}

export default ArtistsPage
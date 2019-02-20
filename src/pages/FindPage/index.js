import React from 'react'
import {get} from '@/utils/ajax'
import style from './style/index.module.less'
import {Carousel} from 'antd-mobile'
import image from './img/1.png'
import {Link,withRouter} from 'react-router-dom'
import Scroll from '@/components/Scroll'
import {formatNumber} from '@/utils/util'

// https://www.cnblogs.com/zyl-Tara/p/7998590.html
// 关于react中切换路由时报以上错误，实际的原因是因为在组件挂载（mounted）之后进行了异步操作，比如ajax请求或者设置了定时器等，而你在callback中进行了setState操作。当你切换路由时，组件已经被卸载（unmounted）了，此时异步操作中callback还在执行，因此setState没有得到值。

@withRouter
class Index extends React.Component{
    state = {
        banners:[{imageUrl:image}], //给一个初始值，避免在数据返回之前为空数组
        hotSingerList:[],  //热门歌手列表
        recommendList:[],  //推荐歌单
        highqualityList:[], //精品歌单
    }

    componentDidMount(){
        this.initPage()
    }
    componentWillUnmount(){
        this.setState = ()=>{
            return;
        };
    }
    initPage = ()=>{
        Promise.all([
            this.getBanners(),
            this.getHotSingers(),
            this.getRecommends(),
            this.getHighqualitys()
        ])
    }
    getBanners = async ()=>{
        const res = await get('/banner')
        this.setState({
            banners:res.banners || [{imageUrl:image}]
        })
    }
    getHotSingers = async ()=>{
        const res = await get('/top/artists?offset=0&limit=8')
        this.setState({
            hotSingerList:res.artists || []
        })
    }
    getRecommends = async ()=>{
        const res = await get('/personalized')
        const list = res.result || []
        this.setState({
            recommendList:list.slice(0,6)
        })
    }
    getHighqualitys = async ()=>{
        const res = await get('/top/playlist/highquality?limit=6')
        this.setState({
            highqualityList:res.playlists || []
        })
    }


    render(){
        const {banners,hotSingerList,recommendList,highqualityList} = this.state

        const menu = [
            {
                title:'热门歌手',
                icon:'icon-remen1',
                url:'/artists',
                color:'#dd4330'
            },
            {
                title:'每日推荐',
                icon:'icon-PCbofangye_paihangbang',
                url:'/playlists',
                color:'orange'
            },
            {
                title:'歌单',
                icon:'icon-liebiao1',
                url:'/playlists',
                color:'#16c2c2',
            },
        ]

        return(
            <div className={style.container}>
                <Scroll>
                    <div>
                        <div className={style['banners-box']}>
                            <Carousel infinite autoplay>
                                {banners && banners.map(item=> <img key={item.imageUrl} src={item.imageUrl} alt=""/>)}
                            </Carousel>
                        </div>
                        <div className={style.menu}>
                            {menu.map(item=><div key={item.title}>
                                <Link to={item.url}>
                                    <div className={`iconfont ${style.icon} ${item.icon}`} style={{color:item.color}}/>
                                    <div>{item.title}</div>
                                </Link>
                            </div>)}
                        </div>
                        <div className={style['hot-singer-box']}>
                            <div className={style['title-box']}>
                                <div>热门歌手</div>
                                <Link to={'/artists'}>查看全部</Link>
                            </div>
                            <ul>
                                {hotSingerList && hotSingerList.map(singer=><li key={singer.id}>
                                    <Link to={`/singer/${singer.id}`} className={style['singer-box']}>
                                        <img src={singer.img1v1Url} alt=""/>
                                        <div>{singer.name}</div>
                                    </Link>
                                </li>)}
                            </ul>
                        </div>
                        <div className={style['recommend-box']}>
                            <div onClick={()=>this.props.history.push('/playlists')}>每日推荐 <span className={'iconfont' +
                            ' icon-iconfontjiantou5'} style={{fontSize:12}}/></div>
                            <ul>
                                {recommendList && recommendList.map(sheet=><li key={sheet.id}>
                                    <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                        <img src={sheet.picUrl} alt=""/>
                                        <div>{sheet.name}</div>
                                        <p className={style.playCount}><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(sheet.playCount)}</p>
                                    </Link>
                                </li>)}
                            </ul>
                        </div>
                        <div className={style['recommend-box']}>
                            <div onClick={()=>this.props.history.push('/playlists')}>精品歌单 <span className={'iconfont icon-iconfontjiantou5'} style={{fontSize:12}}/></div>
                            <ul>
                                {highqualityList && highqualityList.map(sheet=><li key={sheet.id}>
                                    <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                        <img src={sheet.coverImgUrl} alt=""/>
                                        <div>{sheet.name}</div>
                                        <p className={style.playCount}><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(sheet.playCount)}</p>
                                    </Link>
                                </li>)}
                            </ul>
                        </div>
                    </div>
                </Scroll>
            </div>
        )
    }
}

export default Index
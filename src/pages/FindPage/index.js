import React from 'react'
import {get} from '@/utils/ajax'
import style from './style/index.module.less'
import {Carousel} from 'antd-mobile'
import image from './img/1.png'
import {Link} from 'react-router-dom'

class Index extends React.Component{
    state = {
        banners:[{imageUrl:image}], //给一个初始值，避免在数据返回之前为空数组
        hotSingers:[],  //热门歌手列表
        recommends:[],  //推荐歌单
        highqualitys:[], //精品歌单
    }

    componentDidMount(){
        this.initPage()
    }
    initPage = ()=>{
        Promise.all([
            this.getBanners(),
            this.getHotSingers(),
            this.getRecommends(),
            this.getHighqualitys()
        ]).then(res=>{
            // console.log(444)
        })
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
            hotSingers:res.artists || []
        })
    }
    getRecommends = async ()=>{
        const res = await get('/personalized')
        const list = res.result || []
        this.setState({
            recommends:list.slice(0,6)
        })
    }
    getHighqualitys = async ()=>{
        const res = await get('/top/playlist/highquality?limit=6')
        this.setState({
            highqualitys:res.playlists || []
        })
    }


    render(){
        const {banners,hotSingers,recommends,highqualitys} = this.state

        const menu = [
            {
                title:'热门歌手',
                icon:'icon-remen1',
                url:'1',
                color:'#dd4330'
            },
            {
                title:'每日推荐',
                icon:'icon-remen1',
                url:'1',
                color:'#dd4330'
            },
            {
                title:'歌单',
                icon:'icon-remen',
                url:'1',
                color:'#dd4330'
            },
        ]

        return(
            <div className={style.container}>
                <div className={style['banners-box']}>
                    <Carousel infinite autoplay>
                        {banners && banners.map(item=> <img key={item.imageUrl} src={item.imageUrl} alt=""/>)}
                    </Carousel>
                </div>
                <div className={style.menu}>
                    {menu.map(item=><div key={item.title}>
                        <div className={`iconfont ${style.icon} ${item.icon}`} style={{color:item.color}}/>
                        <div>{item.title}</div>
                    </div>)}
                </div>
                <div className={style['hot-singer-box']}>
                    <div className={style['title-box']}>
                        <div>热门歌手</div>
                        <Link to={'/hotSingers'}>查看全部</Link>
                    </div>
                    <ul>
                        {hotSingers && hotSingers.map(singer=><li key={singer.id}>
                            <Link to={`/singer/${singer.id}`} className={style['singer-box']}>
                                <img src={singer.img1v1Url} alt=""/>
                                <div>{singer.name}</div>
                            </Link>
                        </li>)}
                    </ul>
                </div>
                <div className={style['recommend-box']}>
                    <div>每日推荐 &gt;</div>
                    <ul>
                        {recommends && recommends.map(sheet=><li key={sheet.id}>
                            <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                <img src={sheet.picUrl} alt=""/>
                                <div>{sheet.name}</div>
                            </Link>
                        </li>)}
                    </ul>
                </div>
                <div className={style['recommend-box']}>
                    <div>精品歌单 &gt;</div>
                    <ul>
                        {highqualitys && highqualitys.map(sheet=><li key={sheet.id}>
                            <Link to={`/sheet/${sheet.id}`} className={style['sheet-box']}>
                                <img src={sheet.coverImgUrl} alt=""/>
                                <div>{sheet.name}</div>
                            </Link>
                        </li>)}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Index
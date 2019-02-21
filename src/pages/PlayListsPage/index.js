import React from 'react'
import style from './style/index.module.less'
import { get } from '@/utils/ajax'
import NavBar from '@/components/NavBar'
import CatMenu from './CatMenu'
import Loading from '../../components/Loading/index'
import List from './List'
import Scroll from '@/components/Scroll'

class PlayListsPage extends React.Component {
    state = {
        catlist: [],   //分类列表
        cat:['全部','全部'], //选择的分类
        isOpen:false,   //是否展开分类菜单
        loading:false, //获取歌单的loading
        playlists:[],   //歌单列表
        headerInfo:{},
        isLoadMore:false, //加载更多
        haveMore:true  //是否还有更多
    }

    componentDidMount () {
        this.getHeaderInfo()
        this.getCatlist()
        this.getPlaylists(this.state.cat)
    }
    getHeaderInfo = async ()=>{
        const res = await get('/top/playlist/highquality')
        this.setState({
            headerInfo: res.playlists ? (res.playlists[0] || {}) : {}
        })
    }

    getCatlist = async () => {
        const res = await get('/playlist/catlist')
        let catlist = []
        if (res.categories) {
            Object.entries(res.categories).forEach(item => {
                catlist.push({
                    value: item[1],
                    label: item[1]
                })
            })

            res.sub.forEach(item => {
                if (catlist[item.category].children) {
                    catlist[item.category].children.push({
                        value: item.name,
                        label: item.name
                    })
                } else {
                    catlist[item.category].children = [{
                        value: item.name,
                        label: item.name
                    }]
                }
            })
        }
        catlist.unshift( {
            value: '全部',
            label: '全部',
            children: [
                {
                    value: '全部',
                    label: '全部',
                }
            ]
        })
        this.setState({
            catlist
        })
    }
    toggleOpen = ()=>{
        this.setState({
            isOpen:!this.state.isOpen
        })
    }
    changeCat = (cat)=>{
        this.setState({
            isOpen:false,
            cat,
        })
        this.getPlaylists(cat)
    }
    getPlaylists = async (cat)=>{
        this.setState({
            loading:true,
            playlists:[],
            haveMore:true
        })
        const res = await get('/top/playlist',{
            cat:cat[1],
            limit:16
        })
        this.setState({
            loading:false,
            playlists:res.playlists || [],
            haveMore:res.more
        })
    }

    onLoadMore = async ()=>{
        if(!this.state.haveMore || this.state.isLoadMore){
            return
        }
        this.setState({
            isLoadMore:true
        })
        const res = await get('/top/playlist',{
            cat:this.state.cat[1],
            limit:16,
            offset:this.state.playlists.length
        })
        //增加两秒的延迟，实际项目中可以不用，这里只是为显示这样一个加载中的过程
        setTimeout(()=>{
            this.setState({
                isLoadMore:false,
                playlists:this.state.playlists.concat(res.playlists || []),
                haveMore:res.more
            })
            this.scroll && this.scroll.finishPullUp()
        },2000)
    }



    render () {
        const {catlist,isOpen,cat,loading,playlists,headerInfo,isLoadMore} = this.state

        return (
            <div className={style.container}>
                <NavBar>歌单</NavBar>
                <div style={{height:'100vh'}}>
                    <Scroll onPullingUp={this.onLoadMore} ref={el=>this.scroll=el}>
                        <div>
                            <div className={style.header}>
                                <img src={headerInfo.coverImgUrl || ''} alt="" className={style['bg-img']}/>
                                <div className={style['info-wrapper']}>
                                    <div className={style.left}><img src={headerInfo.coverImgUrl} alt=""/></div>
                                    <div className={style.right}>
                                        <p className={style.title}><span className={'iconfont icon-jingpin'} style={{color:'orange'}}/> 精品歌单</p>
                                        <p className={style.name}>{headerInfo.name}</p>
                                        <p className={style.other}>{headerInfo.copywriter}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.navbar}>
                                <div className={style.cat} onClick={this.toggleOpen}>{cat[1]} <span className={'iconfont' +
                                ' icon-xiangyoujiantou'} style={{display:'inline-block',transform:'rotate(90deg)'}}/></div>
                                <div className={style.list}>
                                    <span onClick={()=>this.changeCat(['语种','华语'])}>华语</span>丨
                                    <span onClick={()=>this.changeCat(['风格','民谣'])}>民谣</span>丨
                                    <span onClick={()=>this.changeCat(['风格','电子'])}>电子</span>
                                </div>
                            </div>
                            <List list={playlists}/>
                            <div className={style.loading} style={{display:isLoadMore?'':'none'}}>加载中...</div>
                        </div>
                    </Scroll>
                    <Loading loading={loading} style={{top:'60%'}}/>
                    <CatMenu data={catlist} isOpen={isOpen} value={cat} onChange={this.changeCat} closeMenu={this.toggleOpen}/>
                </div>
            </div>
        )
    }
}

export default PlayListsPage
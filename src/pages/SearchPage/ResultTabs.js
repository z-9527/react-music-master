import React from 'react'
import {Tabs} from 'antd-mobile'
import {get} from '@/utils/ajax'
import Loading from '@/components/Loading'
import style from './style/resultTabs.module.less'
import {formatNumber} from '@/utils/util'
import dayjs from 'dayjs'

class ResultTabs extends React.Component{
    state = {
        page:0,  //当前Tab索引
        searchLoading:false,  //搜索loading
        songs:[],     //查询的单曲集合
        albums:[],     //查询的专辑集合
        artists:[],    //查询的歌手集合
        playlists:[],    //查询的歌单集合       不用一个变量保存查询结果是因为防止歌手集合显示专辑集合，因为getResult是异步的。
    }
    componentDidMount(){
        //当重新聚集到input中时ResultTabs组件会销毁，生命周期重新触发，为什么会销毁？
        this.getResult(this.props.keywords)
    }
    componentWillUnmount(){
        this.setState = ()=>{
            return;
        };
    }

    getResult = async (keywords,type=1)=>{
        this.setState({
            searchLoading:true,
            songs:[],
            albums:[],
            artists:[],
            playlists:[]
        })
        const res = await get(`/search?keywords=${keywords}&type=${type}`)
        const result = res.result || {}
        switch (type){
            case 1: {
                this.setState({
                    songs:result.songs || []
                })
                break
            }
            case 10: {
                this.setState({
                    albums:result.albums || []
                })
                break
            }
            case 100: {
                this.setState({
                    artists:result.artists || []
                })
                break
            }
            case 1000: {
                this.setState({
                    playlists:result.playlists || []
                })
                break
            }
            default: {
                this.setState({
                    songs:result.songs || []
                })
                break
            }

        }
        this.setState({
            searchLoading:false,
        })
    }
    handleTabClick = (tab,page) =>{
        this.setState({
            page,
        })
        const {keywords} = this.props
        this.getResult(keywords,tab.type)
    }



    render(){
        const {page,searchLoading,songs,albums,artists,playlists} = this.state

        const tabs = [
            {title:'单曲',type:1},
            {title:'专辑',type:10},
            {title:'歌手',type:100},
            {title:'歌单',type:1000},
        ]

        const NoResult = ()=>(<div className={style['no-result']}>
            <div className={'iconfont icon-wukong'} style={{fontSize:28,marginBottom:10}}/>
            <p>暂无搜索结果...</p>
        </div>)

        return (
            <div>
                <Tabs tabs={tabs} onTabClick={this.handleTabClick} page={page} swipeable={false} animated={false}>
                    {/*单曲*/}
                    <div className={`${style['tab-item']} ${style.songs}`}>
                        <ul>
                            {songs && songs.map(item=><li key={item.id}>
                                <div className={style.left}>
                                    <p className={style.title}>{item.name}</p>
                                    <p className={style.info}>
                                        {item.artists && item.artists.reduce((init,current,index)=>{
                                            if(index < item.artists.length - 1 ){
                                                init += current.name + ' / '
                                            } else {
                                                init += current.name + ' - '
                                            }
                                            return init
                                        },'')}
                                        {item.album && item.album.name}
                                    </p>
                                </div>
                                <div className={'iconfont icon-erji1'}/>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                        {!searchLoading && !songs.length && <NoResult/>}
                    </div>
                    {/*专辑*/}
                    <div className={`${style['tab-item']} ${style.albums}`}>
                        <ul>
                            {albums && albums.map(item=><li key={item.id}>
                                <img src={item.picUrl} alt=""/>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        {item.artists && item.artists.reduce((init,current,index)=>{
                                            if(index < item.artists.length - 1 ){
                                                init += current.name + '/'
                                            } else {
                                                init += current.name + '  '
                                            }
                                            return init
                                        },'')}
                                        {item.size}首&nbsp;
                                        {dayjs(item.publishTime).format('YYYY-MM-DD')}
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                        {!searchLoading && !albums.length && <NoResult/>}
                    </div>
                    {/*歌手*/}
                    <div className={`${style['tab-item']} ${style.artists}`}>
                        <ul>
                            {artists && artists.map(item=><li key={item.id}>
                                <img src={item.img1v1Url} alt="" style={{borderRadius:'50%'}}/>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        <span style={{display:item.albumSize?'':'none'}}>专辑:{item.albumSize}</span>&emsp;
                                        <span style={{display:item.mvSize?'':'none'}}>MV:{item.mvSize}</span>
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                        {!searchLoading && !artists.length && <NoResult/>}
                    </div>
                    {/*歌单*/}
                    <div className={`${style['tab-item']} ${style.playlists}`}>
                        <ul>
                            {playlists && playlists.map(item=><li key={item.id}>
                                <img src={item.coverImgUrl} alt=""/>
                                <div className={style.info}>
                                    <div>{item.name}</div>
                                    <div className={style['sub-info']}>
                                        {item.trackCount}首 - {item.creator.nickname}  播放{formatNumber(item.playCount)}
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                        {!searchLoading && !playlists.length && <NoResult/>}
                    </div>
                </Tabs>
            </div>
        )
    }
}

export default ResultTabs
import React from 'react'
import {Tabs} from 'antd-mobile'
import {get} from '@/utils/ajax'
import Loading from '@/components/Loading'
import style from './style/resultTabs.module.less'

class ResultTabs extends React.Component{
    state = {
        page:0,  //当前Tab索引
        searchLoading:false,  //搜索loading
        resultList:[],  //搜索结果
    }
    componentDidMount(){
        this.getResult(this.props.keywords)
    }

    getResult = async (keywords,type=1)=>{
        this.setState({
            searchLoading:true,
            resultList:[],
        })
        const res = await get(`/search?keywords=${keywords}&type=${type}`)
        console.log(111,res)
        const result = res.result || {}
        let list = []
        switch (type){
            case 1: {
                list = result.songs || []
                break
            }
            case 10: {
                list = result.albums || []
                break
            }
            case 100: {
                list = result.artists || []
                break
            }
            case 1000: {
                list = result.playlists || []
                break
            }
            default: {
                list = result.song || []
                break
            };

        }
        this.setState({
            searchLoading:false,
            resultList: list
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
        const {page,resultList,searchLoading} = this.state

        const tabs = [
            {title:'单曲',type:1},
            {title:'专辑',type:10},
            {title:'歌手',type:100},
            {title:'歌单',type:1000},
        ]

        return (
            <div>
                <Tabs tabs={tabs} onTabClick={this.handleTabClick} page={page} swipeable={false} animated={false}>
                    <div className={`${style['tab-item']} ${style.songs}`}>
                        <ul>
                            {resultList && resultList.map(item=><li key={item.id}>
                                {item.name}
                            </li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                    </div>
                    <div className={`${style['tab-item']}`}>
                        <ul>
                            {resultList && resultList.map(item=><li key={item.id}>{item.name}</li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                    </div>
                    <div className={`${style['tab-item']} ${style.songs}`}>
                        <ul>
                            {resultList && resultList.map(item=><li key={item.id}>{item.name}</li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                    </div>
                    <div className={`${style['tab-item']} ${style.songs}`}>
                        <ul>
                            {resultList && resultList.map(item=><li key={item.id}>{item.name}</li>)}
                        </ul>
                        <Loading loading={searchLoading} style={{position:'absolute',top:'40%'}}/>
                    </div>
                </Tabs>
            </div>
        )
    }
}

export default ResultTabs
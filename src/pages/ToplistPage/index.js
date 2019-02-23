import React from 'react'
import { get } from '@/utils/ajax'
import Loading from '@/components/Loading/index'
import style from './style/index.module.less'
import { withRouter } from 'react-router-dom'
import Scroll from '@/components/Scroll'


@withRouter
class Index extends React.Component {

    state = {
        toplist: [],
        loading: false
    }

    componentDidMount () {
        this.getTopList()
    }

    getTopList = async () => {
        this.setState({
            loading: true
        })
        //获取单个排行榜详情内容用歌单接口
        const res = await get('/toplist/detail')
        const list = res.list || []
        this.setState({
            loading: false,
            topList: list
        })
    }
    goDetail = (id) => {
        const {history} = this.props
        history.push(`/sheet/${id}?isTop=1`)
    }

    render () {
        const {loading, topList} = this.state
        return (
            <div className={style.container}>
                <Scroll>
                    <div>
                        <ul>
                            {topList && topList.map((item) => {
                                return (
                                    <li key={item.id} className={style['top-item']} onClick={() => this.goDetail(item.id)}>
                                        <div>
                                            <img src={item.coverImgUrl} alt=""/>
                                        </div>
                                        <div className={style['top-info']}>
                                            <div className={style.name}>{item.name}</div>
                                            <div>
                                                {item.tracks && item.tracks.map((song, index) => <p key={song.first}>{index + 1}.{song.first}- {song.second}</p>)}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <Loading loading={loading}/>
                    </div>
                </Scroll>
            </div>
        )
    }
}

export default Index
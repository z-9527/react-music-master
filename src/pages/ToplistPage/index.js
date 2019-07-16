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
        topList2: [],
        loading: false
    }

    componentDidMount() {
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
            topList: list.slice(0, 4),
            topList2: list.slice(4)
        })
    }
    goDetail = (id) => {
        const { history } = this.props
        history.push(`/sheet/${id}?isTop=1`)
    }

    render() {
        const { loading, topList, topList2 } = this.state
        return (
            <div className={style.container}>
                <Scroll>
                    <div>
                        <ul>
                            {topList && topList.map((item) => {
                                return (
                                    <li key={item.id} className={style['top-item']} onClick={() => this.goDetail(item.id)}>
                                        <div>
                                            <img src={item.coverImgUrl} alt="" />
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
                        <ul style={styles.box}>
                            {topList2 && topList2.map((item) => {
                                return (
                                    <li key={item.id} className={style['top2-item']} onClick={() => this.goDetail(item.id)}>
                                        <div className={style['img-box']}>
                                            <img src={item.coverImgUrl} alt="" />
                                        </div>
                                        <div className={style['top2-item-info']}>
                                            {item.name}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <Loading loading={loading} />
                    </div>
                </Scroll>
            </div>
        )
    }
}

const styles = {
    box: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
}

export default Index
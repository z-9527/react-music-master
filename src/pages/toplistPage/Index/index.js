import React from 'react'
import { get } from '@/utils/ajax'
import Loading from '@/components/Loading'
import style from './style/index.module.less'
import { withRouter, Route } from 'react-router-dom'
import asyncComponent from '@/utils/AsyncComponent'

const Detail = asyncComponent(() => import('../Detail/index'))

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

        const res = await get('/toplist/detail')
        const list = res.list || []

        this.setState({
            loading: false,
            topList: list.slice(0, 4)
        })
        console.log(res)
    }
    goDetail = (index) => {
        const {match, history} = this.props
        history.push(`${match.url}/top/${index}`)
    }

    render () {
        const {match} = this.props
        const {loading, topList} = this.state
        return (
            <div className={style.container}>
                <ul>
                    {topList && topList.map((item, index) => {
                        return (
                            <li key={item.id} className={style['top-item']} onClick={() => this.goDetail(index)}>
                                <img src={item.coverImgUrl} alt=""/>
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
                <Route path={`${match.url}/top/:idx`} component={Detail}/>
            </div>
        )
    }
}

export default Index
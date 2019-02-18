import React from 'react'
import style from './style/index.module.less'
import { get } from '@/utils/ajax'
import Loading from '@/components/Loading'
import NavBar from '@/components/NavBar'
import Content from './Content'
import {withRouter} from 'react-router-dom'

@withRouter
class SingerPage extends React.Component {
    state = {
        loading: false,
        info: {}
    }

    componentDidMount () {
        const id = this.props.match.params.id
        this.getInfo(id)
    }

    getInfo = async (id) => {
        this.setState({
            loading: true
        })
        const res = await get(`/artists?id=${id}`)
        this.setState({
            loading: false,
            info: res.artist || {}
        })

    }

    render () {
        const {loading, info} = this.state

        return (
            <div className={style.container}>
                <div style={{display: info.name ? '' : 'none'}} className={style.wrapper}>
                    <NavBar>{info.name}</NavBar>
                    <div className={style['singer-img']} style={{backgroundImage: `url(${info.img1v1Url})`}}/>
                    <div className={style['content-box']}>
                        <Content/>
                    </div>
                </div>
                <Loading loading={loading}/>
            </div>
        )
    }
}

export default SingerPage
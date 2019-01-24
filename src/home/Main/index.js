import React from 'react'
import style from './style/index.module.less'
import { inject, observer } from 'mobx-react'
import { NavLink, withRouter } from 'react-router-dom'

@inject('appStore') @withRouter @observer
class Main extends React.Component {
    toggleExpand = () => {
        this.props.appStore.toggleExpand()
    }

    render () {
        const {isExpandSider} = this.props.appStore
        return (
            <div className={style.container} style={{transform: `translateX(${isExpandSider ? '80%' : 0})`}}>
                <div className={style.header}>
                    <span className={'icon-weibiaoti12 iconfont'} onClick={this.toggleExpand}/>
                </div>
                <ul className={style['navigation-menu']}>
                    <li><NavLink to={'/my'} activeClassName={style.active}>我的</NavLink></li>
                    <li><NavLink to={'/singer'} activeClassName={style.active}>歌手</NavLink></li>
                    <li><NavLink to={'/find'} activeClassName={style.active}>发现</NavLink></li>
                    <li><NavLink to={'/rank'} activeClassName={style.active}>排行榜</NavLink></li>
                </ul>


                {isExpandSider && <div className={style.mask} onClick={this.toggleExpand}/>}
            </div>
        )
    }
}

export default Main
import React from 'react'
import style from './style/index.module.less'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import List from './List'

@withRouter @inject('appStore') @observer
class HistoryPage extends React.Component {
    state = {
        tab: ''
    }

    componentDidMount () {
        const search = this.props.location.search
        const isHistory = search.match('isHistory')
        this.setState({
            tab: isHistory ? 'history' : 'like'
        })
    }

    goBack = () => {
        this.props.history.goBack()
    }

    removeLike = (index,song) => {
        this.props.appStore.setLikes(song)
    }
    removeHistory = (index) => {
        this.props.appStore.setPlayHistorys({
            isAdd: false,
            index
        })
    }

    render () {
        const {tab} = this.state
        const {likeSongs, playHistorys, playlist} = this.props.appStore
        const isHistory = tab === 'history'
        const h = playlist.length ? 60 : 0
        const height = {height: `calc(100vh - ${ 44 + h}px`}

        return (
            <div className={style.container}>
                <div className={style.top}>
                    <div className={style.back} onClick={this.goBack}><span className={'iconfont icon-zuojiantou'} style={{fontSize: 25}}/>
                    </div>
                    <div className={style.switch}>
                        <div className={isHistory ? '' : style.active} onClick={() => this.setState({tab: 'like'})}>我喜欢的
                        </div>
                        <div className={isHistory ? style.active : ''} onClick={() => this.setState({tab: 'history'})}>
                            最近听的
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{display: isHistory ? 'none' : ''}}>
                        <div style={height}>
                            <List list={likeSongs} remove={this.removeLike}/>
                        </div>
                        <div className={style.empty} style={{display: likeSongs.length ? 'none' : ''}}>
                            <div className={'iconfont icon-jiarugedan'}/>
                            <p>没有收藏的歌曲</p>
                            <p>你可以挑一些喜欢的单曲添加到这里</p>
                        </div>
                    </div>
                    <div style={{display: isHistory ? '' : 'none'}}>
                        <div style={height}>
                            <List list={playHistorys} remove={this.removeHistory}/>
                        </div>
                        <div className={style.empty} style={{display: playHistorys.length ? 'none' : ''}}>
                            <div className={'iconfont icon-yinyue'}/>
                            <p>没有播放记录</p>
                            <p>这里会自动记录您最近听过的歌曲</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HistoryPage
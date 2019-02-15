import React from 'react'
import style from './style/index.module.less'
import {Switch} from 'antd-mobile'
import {inject,observer} from 'mobx-react'


@inject('appStore') @observer
class Sider extends React.Component{
    state = {
        checked:false,
    }
    componentDidMount(){

    }
    render(){
        const { isExpandSider } = this.props.appStore
        return (
            <div className={style.container}>
                <div className={style.header}>
                    <div>
                        <img src={require('./img/01.jpg')} alt=""/>
                        游客试用
                    </div>
                </div>
                <div className={style.contenr}>
                    <div className={style.section}>
                        <div className={`${style.title} ${style['fade-init']} ${isExpandSider ? style['fade'] : ''}`}>功能</div>
                        <ul className={`${style['side-up-init']} ${isExpandSider ? style['side-up'] : ''}`}>
                            <li>
                                <div className={'iconfont icon-ziyuanldpi'} style={{fontSize:16}}/>
                                <div>均衡器</div>
                            </li>
                            <li>
                                <div className={'iconfont icon-pifu'}/>
                                <div>个性装扮</div>
                            </li>
                            <li>
                                <div className={'iconfont icon-saoyisao1'}/>
                                <div>扫一扫</div>
                            </li>
                            <li>
                                <div className={'iconfont icon-naozhong2'}/>
                                <div>音乐闹钟</div>
                            </li>
                            <li>
                                <div className={'iconfont icon-94'}/>
                                <div>游戏推荐</div>
                            </li>
                            <li>
                                <div className={'iconfont icon-lishibisai'} style={{fontSize:18}}/>
                                <div>定时关闭播放</div>
                                <div><Switch checked={this.state.checked} onChange={()=>this.setState({checked:!this.state.checked})}/></div>
                            </li>
                        </ul>
                        <div className={`${style.divider} ${style['fade-init']} ${isExpandSider ? style['fade'] : ''}`}/>
                    </div>
                    <div className={style.section}>
                        <div className={`${style.title} ${style['fade-init']} ${isExpandSider ? style['fade'] : ''}`}>通用</div>
                        <ul className={`${style['side-up-init']} ${isExpandSider ? style['side-up'] : ''}`}>
                            <li style={{transitionDelay: '.56s'}}>
                                <div className={'iconfont icon-guanyuwomen'} style={{fontSize:18}}/>
                                <div>关于</div>
                            </li>
                            <li style={{transitionDelay: '.64s'}}>
                                <div className={'iconfont icon-fankui'} style={{fontSize:18}}/>
                                <div>帮助与反馈</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sider
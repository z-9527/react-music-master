import React from 'react'
import style from './style/index.module.less'

class MyPage extends React.Component {
    render () {
        return (
            <div>
                <div className={style.section}>
                    <ul>
                        <li>
                            <div className={`iconfont icon-bendi ${style.prefix}`} style={{color: '#3e82f8'}}/>
                            <div className={style.title}>本地歌曲</div>
                            <div className={style.number}>0首</div>
                            <div className={`iconfont icon-bofang ${style.suffix}`}/>
                        </li>
                        <li>
                            <div className={`iconfont icon-lishibisai ${style.prefix}`} style={{color: '#ffc200'}}/>
                            <div className={style.title}>播放历史</div>
                            <div className={style.number}>0首</div>
                            <div className={`iconfont icon-bofang ${style.suffix}`}/>
                        </li>
                        <li>
                            <div className={`iconfont icon-xihuan ${style.prefix}`} style={{color: '#f0437e'}}/>
                            <div className={style.title}>我的喜欢</div>
                            <div className={style.number}>0首</div>
                            <div className={`iconfont icon-bofang ${style.suffix}`}/>
                        </li>
                        <li>
                            <div className={`iconfont icon-xiazai ${style.prefix}`}
                                 style={{fontSize: 26, color: '#000'}}/>
                            <div className={style.title}>我的下载</div>
                            <div className={style.number}>0首</div>
                            <div className={`iconfont icon-bofang ${style.suffix}`}/>
                        </li>
                    </ul>
                </div>
                <div className={style.section} style={{height:250}}>
                    <div className={style['section-title']}>
                        <div>我的歌单</div>
                        <div className={'iconfont icon-jia'}/>
                        <div className={'iconfont icon-liebiao4'}/>
                    </div>
                    <div>
                       <ul>
                           <li>暂无歌单</li>
                       </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyPage
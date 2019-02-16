import React from 'react'
import style from './style/index.module.less'
import {formatNumber} from '@/utils/util'
import dayjs from 'dayjs'

const HeaderInfo = (props)=> {
    const info = props.info
    return (
        <div className={style.container}>
            <img src={info.coverImgUrl || ''} alt="" className={style['bg-img']}/>
            <div className={style['info-wrapper']}>
                <div className={style.left}>
                    <img src={info.coverImgUrl} alt=""/>
                    <p><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(info.playCount)}</p>
                </div>
                <div className={style.right}>
                    <div className={style.name}>{info.name}</div>
                    <div className={style.author}>
                        <img src={info.creator && info.creator.avatarUrl} alt=""/>
                        <span>{info.creator && info.creator.nickname}</span>
                    </div>
                    <div>{dayjs(info.updateTime).format('YYYY-MM-DD')} 更新</div>
                </div>
            </div>
        </div>
    )
}
export default HeaderInfo
import React from 'react'
import style from './style/index.module.less'
import {formatNumber} from '@/utils/util'

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
                <div>

                </div>
            </div>
        </div>
    )
}
export default HeaderInfo
import React from 'react'
import style from './style/list.module.less'
import {formatNumber} from '@/utils/util'
import {Link} from 'react-router-dom'

class List extends React.Component{
    render(){
        const {list} = this.props
        return (
            <div className={style.list}>
                <ul>
                    {list && list.map(item=><li key={item.id}>
                        <Link to={`/sheet/${item.id}`}>
                            <div className={style['img-box']}>
                                <img src={item.coverImgUrl} alt=""/>
                                <p className={style.playCount}><span className={'iconfont icon-erji1'} style={{fontSize:12}}/> {formatNumber(item.playCount)}</p>
                                <p className={style.user}><span className={'iconfont icon-wode1'} style={{fontSize:12}}/> {item.creator && item.creator.nickname}</p>
                            </div>
                            <p className={style.name}>{item.name}</p>
                        </Link>
                    </li>)}
                </ul>
            </div>
        )
    }
}

export default List
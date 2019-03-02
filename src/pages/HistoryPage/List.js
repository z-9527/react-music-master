import React from 'react'
import Scroll from '@/components/Scroll'
import style from './style/list.module.less'
import {inject,observer} from 'mobx-react'

@inject('appStore') @observer
class List extends React.Component {

    onSelectSong = (index)=>{
        this.props.appStore.onSelectSong({
            songlist:this.props.list,
            index
        })
    }
    remove = (index,item,e)=>{
        e.stopPropagation()
        this.props.remove(index,item)
    }
    render () {
        const {list} = this.props
        const {currentSong} = this.props.appStore
        return (
            <Scroll>
                <ul className={style.list}>
                    {
                        list && list.map((item,index) => <li key={item.id} className={item.id === currentSong.id ? style.active : ''} onClick={()=>this.onSelectSong(index)}>
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.ar.map(i => i.name).join('/')}</p>
                            </div>
                            <div onClick={(e)=>this.remove(index,item,e)}>
                                <span className={style.icon}>×</span>
                            </div>
                        </li>)
                    }
                </ul>
            </Scroll>
        )
    }
}

export default List

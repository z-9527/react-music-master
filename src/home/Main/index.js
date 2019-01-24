import React from 'react'
import style from './style/index.module.less'
import {inject,observer} from 'mobx-react'


@inject('appStore') @observer
class Main extends React.Component{
    toggleExpand = ()=>{
        this.props.appStore.toggleExpand()
    }
    render(){
        const {isExpandSider} = this.props.appStore
        return (
            <div className={style.container} style={{transform:`translateX(${isExpandSider?'80%':0})`}}>
                <div className={style.header}>
                    <span className={'icon-caidan1 iconfont'} onClick={this.toggleExpand}/>
                </div>
                <div onClick={this.toggleExpand}>测试</div>
                {isExpandSider && <div className={style.mask} onClick={this.toggleExpand}/>}
            </div>
        )
    }
}

export default Main
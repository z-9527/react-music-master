import React from 'react'
import style from './style/index.module.less'
import {withRouter} from 'react-router-dom'

@withRouter
class NavBar extends React.Component{
    goBack = ()=>{
        this.props.history.goBack()
    }
    render(){
        return (
            <div className={style.navbar}>
                <div className={`iconfont icon-zuojiantou ${style.iconfont}`} onClick={this.goBack}/>
                <div className={style.title}>{this.props.children}</div>
            </div>
        )
    }
}

export default NavBar
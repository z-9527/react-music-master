import React from 'react'
import {withRouter} from 'react-router-dom'
import style from './style/index.module.less'

@withRouter
class Detail extends React.Component{

    componentDidMount(){
        console.log(this.props)
    }
    render(){
        return (
            <div className={style.container}>
                fdasfdsaf

            </div>
        )
    }
}

export default Detail
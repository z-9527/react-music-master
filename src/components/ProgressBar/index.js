import React from 'react'
import style from './style/index.module.less'

class ProgressBar extends React.Component{
    render(){
        return (
            <div className={style['progress-bar']}>
                <div className={style['bar-inner']}>
                    <div className={style.progress}></div>
                    <div className={style['progress-btn-wrapper']}>
                        <div className={style['progress-btn']}></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProgressBar
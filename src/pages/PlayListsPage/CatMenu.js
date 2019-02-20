import React from 'react'
import {Menu} from'antd-mobile'
import PropTypes from 'prop-types';
import style from './style/catMenu.module.less'

class CatMenu extends React.Component{
    static propTypes = {
        height:PropTypes.number,
        data:PropTypes.array,
        value:PropTypes.array,
        onChange:PropTypes.func,
        closeMenu:PropTypes.func,
        isOpen:PropTypes.bool,
    }
    static defaultProps = {
        height:document.documentElement.clientHeight *0.45,
        data:[],
        value:[],
        onChange:()=>{},
        closeMenu:()=>{},
        isOpen:false,
    }


    render(){
        const {height,data,value,onChange,closeMenu,isOpen} = this.props
        return (
            <div className={style.wrapper}>
                {
                    isOpen ? <div>
                        <Menu
                            data={data}
                            value={value}
                            height={height}
                            onChange={onChange}
                        />
                        <div onClick={closeMenu} className={style.mask}/>
                    </div> : null
                }
            </div>
        )
    }
}


export default CatMenu
import React from 'react'
import {get} from '@/utils/ajax'
import style from './style/index.module.less'
import {Carousel} from 'antd-mobile'
import image from './img/1.png'

class Index extends React.Component{
    state = {
        banners:[{imageUrl:image}] //给一个初始值，避免在数据返回之前为空数组
    }

    componentDidMount(){
        this.getBanners()
    }
    getBanners = async ()=>{
        const res = await get('/banner')
        this.setState({
            banners:res.banners || [{imageUrl:image}]
        })
        console.log(res)
    }
    render(){
        const {banners} = this.state

        return(
            <div className={style.container}>
                <div className={style['banners-box']}>
                    <Carousel infinite autoplay>
                        {banners && banners.map(item=> <img key={item.imageUrl} src={item.imageUrl} alt=""/>)}
                    </Carousel>
                </div>
            </div>
        )
    }
}

export default Index
import React from 'react'
import BScroll from 'better-scroll'

class Scroll extends React.Component {

    componentDidMount () {
        this.initScroll()
    }
    componentDidUpdate(){
        this.refresh()
    }
    componentWillUnmount(){
        this.destroy()
    }
    initScroll = ()=>{
        this.scroll = new BScroll(this.wrapper,{
            click:true,
            mouseWheel:true
        })
    }
    refresh = ()=>{
        this.scroll && this.scroll.refresh()
    }
    destroy = ()=>{
        this.scroll.destroy()
        this.scroll = null
    }


    render () {
        return (
            <div style={{height: '100%',width:'100%',overflow: 'hidden'}} ref={wrapper => this.wrapper = wrapper}>
                {this.props.children}
            </div>
        )
    }
}

export default Scroll
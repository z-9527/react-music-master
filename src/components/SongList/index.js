import React from 'react'
import PropTypes from 'prop-types'
import Scroll from '@/components/Scroll'
import style from './style/index.module.less'

class SongList extends React.Component {
    static propTypes = {
        list: PropTypes.array,
        bottomLoadingText: PropTypes.string,
        loading: PropTypes.bool,
        loadingMore: PropTypes.func,
        onSelectSong: PropTypes.func,
        currentSong: PropTypes.object,
    }
    static defaultProps = {
        list: [],
        bottomLoadingText:'加载中...',   //底部loading文字
        loading:false,    //是否正在加载
        loadingMore:()=>{},
        onSelectSong:()=>{},
        currentSong:{},

    }

    state = {
        list: []
    }

    componentDidMount () {
        this.setState({
            list: this.props.list.slice()
        })
    }
    //原本想用getDerivedStateFromProps周期，但是this拿不到
    componentDidUpdate(prevProps){
        if (this.props.list !== prevProps.list) {
            this.setState({
                list:this.props.list
            })
        }
    }

    // //新的生命周期,但是拿不到this
    // static getDerivedStateFromProps = (nextProps, prevState) => {
    //     const {list} = nextProps
    //     console.log(1,this)
    //     if (list !== prevState.list) {
    //         // this.scroll && this.scroll.refresh()
    //         return {
    //             list
    //         }
    //     }
    //     return null
    // }

    loadingMore = async ()=>{
        await this.props.loadingMore()
        this.scroll && this.scroll.finishPullUp()
    }
    //一般公共组件不要编写业务逻辑，虽然点击事件都是一样的，但还要从外面传进来,实际上我们可以再用一个容器组件来包裹，在容器组件中接收store
    onSelectSong = (item,index)=>{
        this.props.onSelectSong({
            songlist:this.state.list,
            song:item,
            index
        })
    }


    render () {
        const {list} = this.state
        const {bottomLoadingText,loading,currentSong} = this.props

        return (
            <div className={style['song-list-box']}>
                <Scroll ref={el => this.scroll = el} onPullingUp={this.loadingMore}>
                   <div>
                       <ul>
                           {
                               list && list.map((item,index)=><li key={item.id} onClick={()=>this.onSelectSong(item,index)} className={currentSong.id===item.id ? style.active : ''}>
                                   <div className={`${style.num} ${index<3 ? style.red : ''}`}>{index + 1}</div>
                                   <div className={style.pic}>
                                       <img src={item.al && item.al.picUrl} alt=""/>
                                   </div>
                                   <div className={style.text}>
                                       <h3>{item.name}</h3>
                                       <div>
                                           {item.ar && item.ar.reduce((init,current,index)=>{
                                               if(index < item.ar.length - 1 ){
                                                   init += current.name + ' / '
                                               } else {
                                                   init += current.name + ' - '
                                               }
                                               return init
                                           },'')}
                                           {item.al && item.al.name}
                                       </div>
                                   </div>
                                   <p className={`iconfont ${currentSong.id===item.id ? 'icon-bofang2':'icon-bofang'}`} style={{fontSize:20}}/>
                               </li>)
                           }
                       </ul>
                       {
                           loading && list.length ? <div className={style.loading}>{bottomLoadingText}</div> : null
                       }

                   </div>
                </Scroll>
            </div>
        )
    }
}

export default SongList
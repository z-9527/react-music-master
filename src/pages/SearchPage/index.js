import React from 'react'
import { get } from '@/utils/ajax'
import { SearchBar } from 'antd-mobile'
import style from './style/index.module.less'
import ResultTabs from './ResultTabs'
import Loading from '../../components/Loading/index'

class SearchPage extends React.Component {
    state = {
        hotlist: [],   //热门搜索列表
        isFocus: false, //输入框是否聚焦
        keywords: '', //搜索关键词
        suggestList: [],  //搜索建议列表
        searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],  //搜索历史
        isSearch:false, //是否搜索

    }

    componentDidMount () {
        this.getHotlist()
    }
    componentWillUnmount(){
        this.setState = ()=>{
            return;
        };
    }

    getHotlist = async () => {
        const res = await get('/search/hot')
        this.setState({
            hotlist: res.result ? res.result.hots : []
        })
    }
    getSuggestList = async (keywords) => {
        if (!keywords) {
            this.setState({
                suggestList: []
            })
            return
        }
        const res = await get(`/search/suggest`, {
            keywords,
            type: 'mobile'
        })
        this.setState({
            suggestList: res.result ? res.result.allMatch : []
        })
    }
    handleChange = async (keywords) => {
        this.getSuggestList(keywords)
        this.setState({
            keywords,
            isSearch:false
        })
    }
    search = async (keywords) => {
        this.setState({
            keywords,
            isSearch:true,
        })
        this.addHistory(keywords)

    }
    addHistory = (keywords) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        const index = searchHistory.findIndex(item => item === keywords)
        if (index !== -1) {
            searchHistory.splice(index, 1)
        }
        searchHistory.unshift(keywords)

        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
        this.setState({
            searchHistory
        })
    }
    removeHistory = (index) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []
        searchHistory.splice(index, 1)
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
        this.setState({
            searchHistory
        })
    }

    render () {
        const {hotlist, isFocus, keywords, suggestList, searchHistory,isSearch} = this.state

        const FocusBox = () => <div>
            {
                isSearch ? <div>
                    <ResultTabs keywords={keywords}/>
                </div> : <div>
                    <ul className={style['suggest-box']}>
                        {suggestList && suggestList.map(item => <li key={item.keyword} onClick={()=>this.search(item.keyword)}>
                            <div className={'iconfont icon-sousuo1'}/>
                            <div>{item.keyword}</div>
                        </li>)}
                    </ul>
                </div>
            }
        </div>

        const BlurBox = () => <div>
            <div className={style['hot-list-box']}>
                <div style={{display:hotlist.length?'':'none'}}>热门搜索</div>
                <ul>
                    {hotlist && hotlist.map(hot => <li key={hot.first} onClick={()=>this.search(hot.first)}>{hot.first}</li>)}
                </ul>
                <ol style={{display:hotlist.length?'':'none'}}>
                    {searchHistory && searchHistory.map((item,index) => <li key={item}>
                        <div className={'iconfont icon-lishibisai'}/>
                        <div onClick={()=>this.search(item)}>{item}</div>
                        <div className={'iconfont icon-lvzhou_shanchu_lajitong'} onClick={()=>this.removeHistory(index)}/>
                    </li>)}
                </ol>
                <Loading loading={!hotlist.length}/>
            </div>
        </div>

        return (
            <div className={style.container}>
                <div>
                    <SearchBar
                        value={keywords}
                        onSubmit={this.search}
                        onChange={this.handleChange}
                        placeholder={'搜索歌手、歌曲、专辑'}
                        onBlur={() => this.setState({isFocus: false})}
                        onFocus={() => this.setState({isFocus: true})}/>
                </div>
                <div>
                    {(keywords || isFocus) ? <FocusBox/> : <BlurBox/>}
                </div>
            </div>
        )
    }
}

export default SearchPage
import {observable,action} from 'mobx'

class AppStore {
    @observable isExpandSider

    constructor (){
        this.isExpandSider = false
    }

    @action
    toggleExpand = ()=>{
        this.isExpandSider = !this.isExpandSider
    }
}

export default new AppStore()
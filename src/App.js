import React, { Component } from 'react'
import './App.css'
import SiderMenu from './home/SiderMenu'
import Main from './home/Main'
import './assets/iconfont/style.css'

class App extends Component {
    render () {
        return (
            <div style={styles.container}>
                <SiderMenu/>
                <Main/>
            </div>
        )
    }
}

const styles = {
   container:{
       width:'100vw',
       height:'100vh',
       overflow:'hidden'
   }
}

export default App

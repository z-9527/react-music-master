import React from 'react'
import { observer, inject } from 'mobx-react'
import MiniPlayer from './MiniPlayer'
import NormalPlayer from './NormalPlayer'

@inject('appStore') @observer
class Player extends React.Component {
    componentDidMount () {
        this.props.appStore.setStore({
            audio: this.audio
        })
    }
    onCanPlay = ()=>{
        this.props.appStore.onCanPlay()
    }
    onError = ()=>{
        this.props.appStore.onError()
    }
    onEnded = ()=>{
        this.props.appStore.onEnded()
    }

    render () {
        const {playlist, currentSong} = this.props.appStore
        return (
            <div style={{display: playlist.length > 0 ? '' : 'none'}}>
                <NormalPlayer/>
                <MiniPlayer/>
                <audio
                    onCanPlay={this.onCanPlay}
                    onError={this.onError}
                    onEnded={this.onEnded}
                    src={currentSong.url}
                    ref={audio => this.audio = audio}/>
            </div>
        )
    }
}

export default Player
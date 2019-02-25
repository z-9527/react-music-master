import React from 'react'
import { observer, inject } from 'mobx-react'
import MiniPlayer from './MiniPlayer'
import NormalPlayer from './NormalPlayer'

@inject('appStore') @observer
class Player extends React.Component {
    render () {
        const {playlist} = this.props.appStore
        return (
            <div style={{display: playlist.length > 0 ? '' : 'none'}}>
                <NormalPlayer/>
                <MiniPlayer/>
            </div>
        )
    }
}

export default Player
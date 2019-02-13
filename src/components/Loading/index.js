import React from 'react'
import PropTypes from 'prop-types'
import style from './style/index.module.less'

class Loading extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        loading: PropTypes.bool,
        style: PropTypes.object
    }
    static defaultProps = {
        style: {}
    }
    matchingType = (type) => {
        switch (type) {
            case 'line-scale': {
                return (
                    <div className={style['line-scale']}>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                )
            }
            case 'ball-clip-rotate-multiple': {
                return (
                    <div className={style['ball-clip-rotate-multiple']}>
                        <div/>
                        <div/>
                    </div>
                )
            }
            case 'ball-clip-rotate-pulse': {
                return (
                    <div className={style['ball-clip-rotate-pulse']}>
                        <div/>
                        <div/>
                    </div>
                )
            }
            case 'square-spin': {
                return (
                    <div className={style['square-spin']}>
                        <div/>
                    </div>
                )
            }
            case 'ball-scale': {
                return (
                    <div className={style['ball-scale']}>
                        <div/>
                    </div>
                )
            }
            case 'ball-scale-multiple': {
                return (
                    <div className={style['ball-scale-multiple']}>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                )
            }
            default:
                return (
                    <div className={style['line-scale']}>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                )
        }
    }

    render () {
        const {type, loading} = this.props
        return loading ? (
            <div className={style['loading-box']} style={this.props.style}>
                {this.matchingType(type)}
            </div>
        ) : null
    }
}

export default Loading
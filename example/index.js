// @flow
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Service, RxService } from '../src'

type typeState = {
    x: number,
    y: number
}


class Data extends RxService<typeState> {
    constructor() {
        const state: typeState = {
            x: 1,
            y: 2,
        }
        super({ state })
    }
}

const data = new Data()

window.data = data
@data.connect(state => ({
    z: state.x + state.y
}))
class App extends Component<{}> {
    render() {
        return <div>{ this.props.z }</div>
    }
}
data.state$.subscribe(data => console.log('==========', data))
ReactDOM.render(
    <App />,
    document.getElementById('app')
)

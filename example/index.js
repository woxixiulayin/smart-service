// @flow
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Service, RxService } from '../src'
import withService from '../src/withService'

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

// @data.connect(state => ({
//     num: state.x + state.y
// }))
// class App extends Component<{}> {
//     render() {
//         return <div>{ this.props.num }</div>
//     }
// }
@withService(Data, state => ({
    num: state.x + state.y
}))
class App extends Component<{}> {
    render() {
        console.log(this.props.data)
        return <div>{ this.props.num }</div>
    }
}
window.Service = Service
window.Data = Data
Service.getServiceInstance(Data).state$.subscribe(data => console.log('==========', data))

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

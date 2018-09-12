import React, { Component } from 'react'
import { mount } from 'enzyme'
import connectService from '../connectService'
import Service from '../Service'

describe('test connectService', () => {

    class Data extends Service<{a: number}> {
        constructor() {
            const state = {
                a: 1
            }
            super({ state })
        }
    }

    const data = new Data()

    @connectService(data, state => ({ num: state.a }))
    class App extends Component {
        render() {
            return <div>{this.props.num}</div>
        }
    }

    it('should change when setState', () => {
        const wrapper = mount(<App />)
        expect(wrapper.text()).toBe('1')
        data.setState({ a: 2 })
        expect(wrapper.text()).toBe('2')
    })

})
import React, { Component } from 'react'
import { mount, ReactWrapper } from 'enzyme'
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

    @connectService(data, (state, ownProps) => {
        return {
            num: state.a,
            id: ownProps.id
        }
    })
    class App extends Component {
        render() {
            return <div>{this.props.num}</div>
        }
    }

    let wrapper: ReactWrapper

    beforeEach(() => {
        wrapper = mount(<App id={1} />)
    })

    it('should change when setState', () => {
        expect(wrapper.text()).toBe('1')
        data.setState({ a: 2 })
        expect(wrapper.text()).toBe('2')
    })

    it('should passBy props', () => {
        expect(wrapper.childAt(0).props().id).toBe(1)
    })

    it('should passBy service instance', () => {
        expect(wrapper.childAt(0).props().data).toBeTruthy()
    })

    it('should mapState work', () => {
        expect(wrapper.childAt(0).props().id).toBe(1)
    })

})
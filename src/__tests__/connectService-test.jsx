import React, { Component } from 'react'
import { mount, ReactWrapper } from 'enzyme'
import connectService from '../connectService'
import Service from '../Service'

describe('test connectService', () => {

    class DataService extends Service<{a: number}> {
        constructor() {
            const state = {
                a: 1
            }
            super({ state })
        }
    }

    const dataService = new DataService()

    @connectService(dataService, (state, ownProps) => {
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

    it('should get correct props at first and subscribe service', () => {
        expect(dataService.nextListeners.length).toBe(1)
        wrapper.unmount()
        expect(dataService.nextListeners.length).toBe(0)
    })

    it('should change when produceState', () => {
        expect(wrapper.text()).toBe('1')
        dataService._produceState(state => { state.a = 2 })
        expect(wrapper.text()).toBe('2')
    })

    it('should passBy props', () => {
        expect(wrapper.childAt(0).props().id).toBe(1)
    })

    it('should passBy service instance and can use self defined service name', () => {
        @connectService(dataService, null, 'myDataService')
        class App extends Component {
            render() {
                return <div>{this.props.num}</div>
            }
        }
        const instance = mount(<App />)
        expect(instance.childAt(0).props().myDataService).toBe(dataService)
    })

    it('should mapState work', () => {
        expect(wrapper.childAt(0).props().id).toBe(1)
    })

    it('should get inside dumb component by getWrappedInstance', () => {
        @connectService(dataService, null, 'myDataService')
        class App extends Component {
            test() {
                return 'test getWrappedInstance'
            }
            render() {
                return <div>{this.props.num}</div>
            }
        }
        const instance = mount(<App />)
        console.log(instance.childAt(0).props())
        // expect(appInstance.getWrappedInstance().test()).toBe('test getWrappedInstance')
    })

})
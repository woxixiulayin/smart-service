jest.mock('../connectService.js')
import { mount } from 'enzyme'
import React, { Component } from 'react'
import connectService from '../connectService'
import withService from '../withService'
import Service from '../Service'


type typeState = {
    x: number,
    y: number
}

describe('test withService', () => {
    
    class Test extends Service<typeState> {
        constructor() {
            const state: typeState = {
                x: 1,
                y: 2
            }
            super({ state })
        }
    }
    
    
    it('withService will inject service and register service if not exist', () => {
        const mapState = jest.fn()
        expect(Service.getServiceInstance(Test)).toBeFalsy()
        
        // should create Service if not exist
        expect(Service.getServiceInstance(Test)).toBeFalsy()
        withService(Test, mapState)
        let test = Service.getServiceInstance(Test)
        expect(test).toBeTruthy()
        
        // should call connectService with param serviceInstance
        expect(connectService.mock.calls[0][0]).toBe(test)
        expect(connectService.mock.calls[0][1]).toBe(mapState)

        // should get serviceInstance even has created Service
        withService(Test, mapState)
        test = Service.getServiceInstance(Test)
        expect(test).toBeTruthy()
    })

    it('withService can inject different classes with the same name', () => {
        // in last test service with name test is already in serviceMap
        class Test extends Service<typeState> {
            constructor() {
                const state: typeState = {
                    x: 3,
                    y: 4
                }
                super({ state })
            }
        }
        const mapState = jest.fn()
        // should create Service if not exist
        expect(Service.getServiceInstance(Test)).toBeFalsy()
        withService(Test, mapState)
        let test = Service.getServiceInstance(Test)
        expect(test.getState().x).toBe(3)
    })
})
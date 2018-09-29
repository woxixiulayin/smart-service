// @flow
import connectService from './connectService'
import { typeProps } from './types'
import { produce } from 'immer'
import getClassName from './utils/getClassName'

type typeServiceMap = Map<string, Service<any>>

/**
 * base Service Class, each Service will have single instance in the whole system, and this is done by Service's self
 * use withService to insert service instance and state into React Component
 * use injectService to insert service instance into Other service as its constructor param (like service in Angular)
 * 
 * you can create sync and async methods inside service and insert service instance into other service or component for use
 */
class Service <T> {

    // manage service instance
    static serviceMap: typeServiceMap = new Map()

    // insert different service instance into serviceMap
    static registerService = (ServiceClass): Service<T> => {
        const name = getClassName(ServiceClass)
        if (Service.serviceMap.has(name)) {
            throw new Error(`service ${name} has already be in the serviceMap`)
        }
        const serviceInstance = new ServiceClass()
        Service.serviceMap.set(name, serviceInstance)

        return serviceInstance
    }

    static unregisterService = (ServiceClass): boolean => {
        const name = getClassName(ServiceClass)
        if (!Service.serviceMap.has(name)) {
            return false
        }

        Service.serviceMap.delete(name)

        return true
    }

    // use service Class to find service instance
    static getServiceInstance = ServiceClass => Service.serviceMap.get(getClassName(ServiceClass)) || false

    // properties
    _state: T
    name: string
    currentListeners: Array<(state: T) => any>
    nextListeners: Array<(state: T) => any>
    
    constructor({ state }: {
        state: T,
    }) {
        this.name = getClassName(this.__proto__.constructor)
        this.currentListeners = []
        this.nextListeners = []
        this._state = state
    }
    
    getState(): T {
        return this._state
    }

    /**
     * use immer.produce to change service state, this will reset state as a new data if it change.Use immer will easy the way of immutable program.And immutable is import for react.
     * 
     * _produceState should be the only way to change service state.You can create sync or async method based on _produceState.You can als create async methods based on sync methods which based on _produceState.
     * 
     * it should be used as private methods in Service and outsiders should use sync or async method to change state
     * 
     * @param {(state: T) => void} updater - function define how to shape state or just return a new state
    * */
    _produceState(updater: (state: T) => void | T) {
        const preState = this._state

        if (typeof updater !== 'function') {
            throw new Error('produceState only accept function as param')
        }

        this._state = produce(preState, updater)
    
        // only call stateDidChange when state really change
        if (this._state !== preState) {
            this.stateDidChange(preState)
        }
    }

    // state changed hook
    stateDidChange(preState: T) {

        const currentListeners = this.currentListeners = this.nextListeners.slice()

        // call listeners
        for (const listener of currentListeners) {
            listener(this._state)
        }
    }

    // for register listener for state change
    subscribe(listener: (state: T) => any): Function {
        let isSubscribed = true
        
        this.nextListeners.push(listener)
        
        const unsubscribe = () => {
            if (!isSubscribed) return

            isSubscribed = false
            this.nextListeners.splice(this.nextListeners.indexOf(listener), 1)
        }

        return unsubscribe
    }
}
export default Service

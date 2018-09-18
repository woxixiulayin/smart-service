// @flow
import connectService from './connectService'
import { typeProps } from './types'
import { produce } from 'immer'
import getClassName from './utils/getClassName'

const log = console.log

type typeServiceMap = Map<string, Service<any>>

class Service <T> {

    static serviceMap: typeServiceMap = new Map()

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
            throw new Error(`service ${name} is not in the serviceMap`)
        }

        Service.serviceMap.delete(name)

        return true
    }

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
    
    produceState(updater: (state: T) => void) {
        const preState = this._state

        if (typeof updater !== 'function') {
            throw new Error('produceState only accept function as param')
        }

        this._state = produce(preState, updater)
        
        this.stateDidChange(preState)
    }
    
    stateDidChange(preState: T) {
        log(`service ${this.name} state change from`, preState, 'to', this._state)
        
        const currentListeners = this.currentListeners = this.nextListeners.slice()
        for (const listener of currentListeners) {
            listener(this._state)
        }
    }

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

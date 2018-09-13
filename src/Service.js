// @flow
import connectService from './connectService'
import { typeProps } from './types'

const log = console.log

type typeServiceMap = Map<string, Service<any>>

const getClassName = Class => String.prototype.toLocaleLowerCase.call(Class.name)

class Service <T> {

    static serviceMap: typeServiceMap = new Map()

    static registerService = (ServiceClass): Service<T> => {
        const name = getClassName(ServiceClass)
        if (Service.serviceMap.has(name)) {
            throw new Error(`service ${name} has already be in the serviceMap`)
        }
        const serviceInstance = new ServiceClass()
        Service.serviceMap.set(name, serviceInstance)
        console.log('+++++', Service.serviceMap)

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
    listeners: Array<(state: T) => any>
    
    constructor({ state }: {
        state: T,
    }) {
        this.name = String.prototype.toLocaleLowerCase.call(this.constructor.name) || 'service'

        this.listeners = []
        this._state = state
    }
    
    getState(): T {
        return this._state
    }
    
    setState(state: T) {
        const preState = this._state
        
        this._state = {
            ...preState,
            ...state
        }
        this.stateDidChange(preState)
    }
    
    stateDidChange(preState: T) {
        log(`service ${this.name} state change from`, preState, 'to', this._state)
        
        const currentListeners = this.listeners.slice()
        for (const listener of currentListeners) {
            listener(this._state)
        }
    }

    subscribe(listener: (state: T) => any) {
        if (this.listeners.indexOf(listener) !== -1) {
            throw new Error('listener should not duplicate subscribe')
        }
        
        this.listeners.push(listener)
        
        const unsubscribe = () => {
            if (this.listeners.indexOf(listener) === -1) {
                throw new Error('listener has already unsubscribe')
            }
            this.listeners.splice(this.listeners.indexOf(listener), 1)
        }

        return unsubscribe
    }
}
export default Service

// @flow
import { TypeDispatch } from './types'
const log = console.log
const serviceInstances = []

let serviceState = {}
const dispatch: TypeDispatch = {}
const getServiceState = () => serviceState

window.getServiceState = getServiceState

const addToDispatch = function(target, name, descriptor) {
    descriptor.value.isDispatchAble = true
    return descriptor.value
}
window.dispatch = dispatch
class Service <A> {
    constructor({
        state
    }: {
        state: A
    }) {
        this.displayName = String.prototype.toLocaleLowerCase.call(this.constructor.name)
        if (serviceInstances[this.displayName]) {
            throw new Error(`can not create same service with name ${this.displayName}`)
        }

        serviceInstances[this.displayName] = this

        for(const key of Object.getOwnPropertyNames(this.__proto__)) {
            if (this[key].isDispatchAble) {
                if (!dispatch[this.displayName]) {
                    dispatch[this.displayName] = {}
                }
                dispatch[this.displayName][key] = this[key].bind(this)
            }
        }

        this.state = {}
        this._listeners = []
        this.setState(state)
    }

    getState(): A {
        return this.state
    }

    setState(updater) {
        const preState = this.state

        if (!serviceInstances[this.displayName]) {  
            throw new Error(`can not setState when service is not in list`)
        }

        if (typeof updater === 'function') {
            this.state = {
                ...preState,
                ...updater(preState)
            }
        } else {
            this.state = {
                ...preState,
                ...updater
            }
        }

        this.onStateChange(preState)
    }


    onStateChange(preState) {
        log(`service ${this.displayName} change state from`, preState, 'to', this.state)
        const preServiceState = serviceState
        
        serviceState = {
            ...preServiceState,
            [this.displayName]: this.state
        }

        log(`serviceState changed from`, preServiceState, 'to', serviceState)

        const currentListeners = this._listeners.slice()
        for (const listener of currentListeners) {
            listener()
        }
    }

    subscribe(listener: Function) {

        this._listeners.push(listener)

        function unsubscribe(){
            this._listeners.splice(this._listeners.indexOf[listener], 1)
        }

        return unsubscribe
    }
}

export {
    Service,
    getServiceState,
    dispatch,
    addToDispatch
}
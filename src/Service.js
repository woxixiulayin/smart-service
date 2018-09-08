// @flow
const log = console.log
const serviceInstances = []

let serviceState = {}

const getServiceState = () => serviceState

class Service<T> {
    constructor({
        state
    }: {
        state: T
    }) {
        this.displayName = this.constructor.name
        if (serviceInstances[this.displayName]) {
            throw new Error(`can not create same service with name ${this.displayName}`)
        }

        serviceInstances[this.displayName] = this

        this._state = {}
        this._listeners = []
        this.setState(state)
    }

    getState():T {
        return this._state
    }

    setState(updater) {
        const preState = this._state

        if (!serviceInstances[this.displayName]) {  
            throw new Error(`can not setState when service is not in list`)
        }

        if (typeof updater === 'function') {
            this._state = {
                ...preState,
                ...updater(preState)
            }
        } else {
            this._state = {
                ...preState,
                ...updater
            }
        }

        this.onStateChange(preState)
    }


    onStateChange(preState) {
        log(`service ${this.displayName} change state from`, preState, 'to', this._state)
        const preServiceState = serviceState
        
        serviceState = {
            ...preServiceState,
            [this.displayName]: this._state
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
}
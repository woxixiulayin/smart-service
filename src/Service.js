// @flow
import connectService from './connectService'
import { typeProps } from './types'

const log = console.log

class Service <T> {

    // properties
    _state: T
    name: string
    listeners: Array<(state: T) => any>
    
    constructor({ state, name }: {
        state: T
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

    // provide props for component
    // just for autocomplete purposes
    connect = (mapState: (state: T, props: typeProps) => typeProps) => connectService(this, mapState)

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

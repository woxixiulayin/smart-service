// @flow
import Service from './Service'
import { typeServiceCenter } from './types'

function createServiceCenter(): typeServiceCenter {

    let state = {}

    function register(service: Service, name = ''): number {
        const serviceName = name || service.constructor.name

        if (serviceName in state) {
            throw new Error('can not set same name service')
        }

    }

    function getState() {
        return state
    }

    subscribe(listener: Function) {
        assert(typeof listener === 'function', 'subscribe should accept a function')
        this.listeners.push(listener)

        function unsubscribe() {
            this.listeners.splice(this.listeners.indexOf(listener), 1)
        }

        return unsubscribe
    }

    return {
        register,
        subscribe,
    }
}
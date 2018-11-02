// @flow
import * as React from 'react'
import Service from './Service'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function noop() {}

/**
 * insert service instance and map State into component
 * 
 * @param {Service<T>} serviceInstance - service instance will be inserted into Component.It can be reach by this.props.[serviceInstance.name]
 * @param {(state: T, ownProps: any) => any} mapState - like mapStateToProps in react-redux, shape props will be passBy to component
 * @param {React.Component<any, any>} WrappedComponent
 * 
 * TODO:
 * 1. fix hot-reload duplicate subscribe error, reference react-redux
 */
const connectService = <T>(serviceInstance: Service<T>, mapState: (state: T, ownProps: any) => any, serviceName: string = '') => (WrappedComponent: React.Component<any, any>) => {

        if (typeof mapState !== 'function') {
            mapState = noop
        }

        return class extends React.Component<any, T> {
        static displayName = `connectService(${serviceInstance.name})`

        unsubscribe: Function | null;
        wrappedInstance: React.Component<any, any> | null;

        constructor(props: any) {
            super(props)
            // do not forget init state
            this.state = {
                ...mapState(serviceInstance.getState(), props)
            }
            this.unsubscribe = null
            this.wrappedInstance = null
            this.unsubscribe = serviceInstance.subscribe(serviceState => {
                // check if this subscription is already unsubscribe
                if (!this.unsubscribe) return
                this.setState(mapState(serviceState, this.props))
            })
        }

        setWrappedInstance = node => {
            this.wrappedInstance = node
        }

        getWrappedInstance = () => this.wrappedInstance

        createExtraProps = () => {

            return {
                ...this.props,
                ...this.state,
            [serviceName || serviceInstance.name]: serviceInstance,
                ref: node => this.setWrappedInstance
            }
        }

        componentWillUnmount() {
            this.unsubscribe && this.unsubscribe()
            this.unsubscribe = null
            if (serviceInstance.currentListeners.length === 0) {
                Service.unregisterService(serviceInstance.constructor)
            }
        }

        render() {
            // passBy state and serviceInstance
            return React.createElement(
                WrappedComponent,
                this.createExtraProps()
            )
        }
    }
}

export default connectService

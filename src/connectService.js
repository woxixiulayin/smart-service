// @flow
import * as React from 'react'
import Service from './Service'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function noop() {}
/**
 * subscribe data from certain service 
 */
const connectService = <T>(serviceInstance: Service<T>, mapState: (state: T, ownProps: any) => any) => (WrappedComponent: React.Component<any, any>) => class extends React.Component<any, T> {
    static displayName = `connectService-${serviceInstance.name}`

    unsubscribe: Function

    constructor(props: any) {
        super(props)
        // do not forget init state
        this.state = {
            ...mapState(serviceInstance.getState(), props)
        }
        this.unsubscribe = noop
    }

    componentDidMount() {
        // console.log('ConnectService',  serviceInstance, this)
        this.unsubscribe = serviceInstance.subscribe(serviceState => {
            // console.log(`on service ${serviceInstance.name} change`, serviceState, this)
            this.setState(mapState(serviceState, this.props))
        })
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
    }

    render() {
        // passBy state and serviceInstance
        return React.createElement(
            WrappedComponent,
            { ...this.props, ...this.state, [serviceInstance.name]: serviceInstance}
        )
    }
}

export default connectService

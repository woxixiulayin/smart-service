// @flow
import React, { ComponentClass, PureComponent } from 'react'
import Service from './Service'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function noop() {}
/**
 * subscribe data from certain service 
 */
const connectService = <T>(service: Service<T>, mapState: (state: T, ownProps: any) => any) => (WrappedComponent: ComponentClass) => class ConnectService extends PureComponent<any, T> {
    static displayName = `connectService-${service.name}`

    unsubscribe: Function

    constructor() {
        super()
        // do not forget init state
        this.state = {
            ...mapState(service.getState(), this.props)
        }
        this.unsubscribe = noop
    }

    componentDidMount() {
        this.unsubscribe = service.subscribe(serviceState => {
            this.setState(mapState(serviceState, this.props))
        })
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
    }

    render() {
        return <WrappedComponent {...this.props} {...this.state} />
    }
}

export default connectService

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
const connectService = <T>(serviceInstance: Service<T>, mapState: (state: T, ownProps: any) => any) => (WrappedComponent: React.Component<any, any>) => class ConnectService extends React.PureComponent<any, T> {
    static displayName = `connectService-${serviceInstance.name}`

    unsubscribe: Function

    constructor() {
        super()
        // do not forget init state
        this.state = {
            ...mapState(serviceInstance.getState(), this.props)
        }
        this.unsubscribe = noop
        console.log('ConnectService', serviceInstance)
    }

    componentDidMount() {
        console.log('ConnectService')
        this.unsubscribe = serviceInstance.subscribe(serviceState => {
            this.setState(mapState(serviceState, this.props))
        })
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
    }

    render() {
        return React.createElement(
            WrappedComponent,
            { ...this.props, ...this.state, [serviceInstance.name]: serviceInstance}
        )
    }
}

export default connectService

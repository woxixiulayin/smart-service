// @flow
import * as React from 'react'
import Service from './Service'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * subscribe data from certain service 
 */
const connectService = <T>(serviceInstance: Service<T>, mapState: (state: T, ownProps: any) => any) => (WrappedComponent: React.Component<any, any>) => class extends React.Component<any, T> {
    static displayName = `connectService-${serviceInstance.name}`

    unsubscribe: Function | null

    constructor(props: any) {
        super(props)
        // do not forget init state
        this.state = {
            ...mapState(serviceInstance.getState(), props)
        }
        this.unsubscribe = null
    }

    componentDidMount() {
        this.unsubscribe = serviceInstance.subscribe(serviceState => {
            // check if this subscription is already unsubscribe
            if (!this.unsubscribe) return
            this.setState(mapState(serviceState, this.props))
        })
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe()
        this.unsubscribe = null
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

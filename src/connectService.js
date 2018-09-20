// @flow
import * as React from 'react'
import Service from './Service'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

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

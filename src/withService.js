// @flow 

import * as React from 'react'
import Service from './Service'
import connectService from './connectService'

function noop() {}

/**
 * inject service instance into component
 * @param {Class<Service<T>} ServiceClass the service Class inject into component
 * @param {?(state: T, ownProps?: any) => any} mapState use as mapStateToProps in react-redux
 */
const withService = <T>(ServiceClass: Class<Service<T>>, mapState: (state: T, ownProps?: any) => any = noop) => {

    const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)

    return connectService(serviceInstance, mapState)
}

export default withService

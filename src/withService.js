// @flow 

import * as React from 'react'
import Service from './Service'
import connectService from './connectService'

function noop() {}

/**
 * inject Service instance into React Component,no need to create service instance by yourself, it wll auto create service instance if it has not created yet.
 * Each 
 * @param {Class<Service<T>} ServiceClass - the service Class injected into Component, you can use component.props.[Service.name] to get service instance, this will be useful when you need methods in service
 * @param {?(state: T, ownProps?: any) => any} mapState - just like mapStateToProps in react-redux
 * @param {String?} serviceName - service's prop name in component, it will use class name if this param not set
 */
const withService = <T>(ServiceClass: Class<Service<T>>, mapState: (state: T, ownProps?: any) => any = noop, serviceName: string = '') => {

    const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)

    return connectService(serviceInstance, mapState, serviceName)
}

export default withService

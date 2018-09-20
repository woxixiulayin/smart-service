// @flow 

import * as React from 'react'
import Service from './Service'
import connectService from './connectService'

function noop() {}

/**
 * inject Service instance into React Component,no need to create service instance by yourself, it wll auto create if need.
 * Each 
 * @param {Class<Service<T>} ServiceClass - the service Class injected into Component, you can use component.props.[Service.name] to get service instance, this will be useful when you need methods in service
 * @param {?(state: T, ownProps?: any) => any} mapState - just like mapStateToProps in react-redux
 */
const withService = <T>(ServiceClass: Class<Service<T>>, mapState: (state: T, ownProps?: any) => any = noop) => {

    const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)

    return connectService(serviceInstance, mapState)
}

export default withService

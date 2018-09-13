// @flow 

import * as React from 'react'
import Service from './Service'
import connectService from './connectService'

const withService = <T>(ServiceClass: Class<Service<T>>, mapState: (state: T) => any) => {

    const serviceInstance = Service.getServiceInstance(ServiceClass) || new ServiceClass()

    console.log('withService', ServiceClass, serviceInstance,)
    return connectService(serviceInstance, mapState)
}

export default withService

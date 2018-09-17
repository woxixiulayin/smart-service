import Service from './Service'
import getClassName from './utils/getClassName'

/**
 * if serviceA depend on serviceB, we can use injectService to inject serviceB instance as serviceA's constructor's param 
 */
const injectService = <T>(ServiceClass: Class<Service<T>>) => target => {
    const name = getClassName(ServiceClass)

    const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)

    const oldProtoType = target.prototype
    target = function(...args) {
        oldProtoType.constructor.call(this, serviceInstance, ...args)
    }

    target.prototype = Object.create(oldProtoType)

    // console.log(target.constructor)
    return target
}

export default injectService
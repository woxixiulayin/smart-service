import Service from './Service'
import getClassName from './utils/getClassName'

/**
 * if serviceA depend on serviceB, we can use injectService to inject serviceB instance as serviceA's constructor's param
 * @param {Class<Service<T>>} ServiceClass - service Class depended by target Class
 * @param {Class<Service<M>>} target - service Class depended by target Class
 */
const injectService = <T, M>(ServiceClass: Class<Service<T>>) => (TargetClass: Class<Service<M>>) => {
    const name = getClassName(ServiceClass)

    const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)

    const oldProtoType = TargetClass.prototype
    TargetClass = function(...args) {
        oldProtoType.constructor.call(this, serviceInstance, ...args)
    }

    TargetClass.prototype = Object.create(oldProtoType)

    // console.log(target.constructor)
    return TargetClass
}

export default injectService
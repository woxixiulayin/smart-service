import Service from './Service'
import { getClassName } from './utils/getClassName'

const injectService = <T>(ServiceClass: Class<Service<T>>) => target => {
    const name = getClassName(ServiceClass)
    const prototype = target.prototype || target.__proto__
    console.log('injectService prototype', prototype)

    if (prototype[name]) {
        return target
    } else {
        const serviceInstance = Service.getServiceInstance(ServiceClass) || Service.registerService(ServiceClass)
        prototype[name] = serviceInstance
        return target
    }
}

export default injectService
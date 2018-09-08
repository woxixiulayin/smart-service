const dispatch = {}

const addService = (service) {
    dispatch[service.name] = service
}

export {
    dispatch,
    addService
}
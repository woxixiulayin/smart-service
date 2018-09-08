// @flow
import Service from './Service'

export type typeServiceCenter = {
    registerService: Function,
    subscribe: (Function) => Function,
    dispatch: Object,
}

export type typeServiceMap = {
    [key: string]: Service
}

export type typeCreateStoreParam = {
    serviceMap: typeServiceMap
}

export type typeCreateServiceParam<T> = {
    state: T,
    onInit: Function,
    methods: {
        [name: string]: (dispatch: Object, getState: Function ) => any
    }
}

export interface typeService {
    getState: Function,
    setState: Function,
    [name: string]: Function
}
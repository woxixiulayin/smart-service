// @flow

export type typeServiceCenter = {
    register: () => Boolean,
    unregister: () => Boolean,
    subscribe: () => Function
}
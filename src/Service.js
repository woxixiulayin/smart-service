// @flow
import assert from './utils/assert'

class Service <A> {
    // 内部保存的数据
    state: A
    listeners: Array<Function>

    constructor({
        state
    }: {
        state: A
    }) {
        this.state = {}
    }

    getState(): A {
        return this.state
    }

    // 纯函数，无副作用，只有setState才能修改service状态
    setState(newState: A) {
        this.state = {
            ...this.state,
            ...newState,
        }
    }

}

export default Service

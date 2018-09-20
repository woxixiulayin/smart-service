// @flow

import Service from './Service'
import { BehaviorSubject } from 'rxjs'

/**
 * when the system is realtime and serverl services are connected each other.
 * RxService will be useful for rxjs program.You can use service.state$ as state stream.
 */
class RxService<T> extends Service<T> {

    state$: BehaviorSubject<T>

    constructor({ state, ...otherParams}) {
        super({ state, ...otherParams})
        this.state$ = new BehaviorSubject(state)
    }

    stateDidChange(preState: T) {
        super.stateDidChange(preState)
        this.state$.next(this._state)
    }
}

export default RxService
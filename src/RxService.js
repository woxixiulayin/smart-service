import Service from './Service'
import { BehaviorSubject } from 'rxjs'

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
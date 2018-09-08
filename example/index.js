// @flow
import { Service, dispatch, markMethod } from '../src/Service'

type AState = {
    name: string
}
type BSate = {
    number: Number
}

export class A extends Service<AState> {
    constructor(name: string) {
        const state: AState = {
            name: name
        }
        super({ state })
    }
}

const a = new A('a')


export class B extends Service<BSate> {
    constructor(number: Number) {
        const state: BSate = {
            number: number
        }
        super({ state })
    }
    
    @markMethod
    changea(name) {
        return a.setState({
            name
        })
    }
}

window.a = a
const b = new B(2)
window.b = b
dispatch.b.changea('sdf')
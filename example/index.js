// @flow
import { Service } from '../src/Service'

type aSate = {
    name: string
}
type bSate = {
    number: Number
}

class A extends Service<aState> {
    constructor(name: string) {
        const state = {
            name: name
        }
        super({ state })
    }
}

const a = new A('class A')



class B extends Service<bState> {
    constructor(number: Number) {
        const state = {
            number: number
        }
        super({ state })
    }

    getAName() {
        return a.getState().number
    }
}

const b = new B(2)


console.log(b.getAName())
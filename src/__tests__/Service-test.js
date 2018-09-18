import Service from '../Service'

type typeState = {
    a: number
}

function noop() {}

describe('test service', () => {
    class Test extends Service<typeState> {
        constructor() {
            const state: typeState = {
                a: 1
            }

            super({ state })
        }
    }

    let test: Test

    beforeEach(() => {
        test = new Test()
    })

    it('produceState can change state', () => {
        const preState = test.getState()
        expect(preState.a).toBe(1)

        test.produceState(state => {
            state.a = 2
        })
        expect(test.getState().a).toBe(2)
        expect(test.getState() === preState).toBeFalsy()
    })

    it('listener should subscribe and unsubscribe service', () => {
        let count = 0
        const unsubscribe = test.subscribe(state => count++)
        test.produceState(state => state)
        expect(count === 1).toBeTruthy()
        unsubscribe()
        test.produceState(state => state)
        expect(count === 1).toBeTruthy()
    })

    it('registerService and unregisterService', () => {
        Service.registerService(Test)

        expect(Service.getServiceInstance(Test)).toBeTruthy()
        expect(() => Service.registerService(Test)).toThrowError('service test has already be in the serviceMap')
        
        Service.unregisterService(Test)
        expect(Service.getServiceInstance(Test)).toBeFalsy()
    })

})
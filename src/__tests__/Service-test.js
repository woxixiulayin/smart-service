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
        test = Service.registerService(Test)
    })

    afterEach(() => {
        Service.unregisterService(Test)
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
    
    it('listener should can subscribe/unsubscribe service', () => {
        let count = 0
        const unsubscribe = test.subscribe(state => count++)
        test.produceState(state => { state.a = 3 })
        expect(count === 1).toBeTruthy()
        unsubscribe()
        test.produceState(state => state)
        expect(count === 1).toBeTruthy()
    })

    it('should call stateDidChange when state really change after produceState', () => {
        let count = 0
        const unsubscribe = test.subscribe(state => count++)
        expect(test.getState().a).toBe(1)
        console.log(test)
        test.produceState(state => { state.a = 1 })
        expect(count === 0).toBeTruthy()
        
        test.produceState(state => { state.a = 2})
        expect(count === 1).toBeTruthy()
    })

    it('registerService and unregisterService', () => {
        
        expect(Service.getServiceInstance(Test)).toBeTruthy()
        expect(() => Service.registerService(Test)).toThrowError('service test has already be in the serviceMap')
        
        Service.unregisterService(Test)
        expect(Service.getServiceInstance(Test)).toBeFalsy()
    })

})
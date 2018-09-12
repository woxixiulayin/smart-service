import Service from '../Service'

type typeState = {
    a: number
}

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

    it('setState be a pure function and change state', () => {
        const preState = test.getState()
        expect(preState.a).toBe(1)

        test.setState({ a: 2 })
        expect(test.getState().a).toBe(2)
        expect(test.getState() === preState).toBeFalsy()
    })
})
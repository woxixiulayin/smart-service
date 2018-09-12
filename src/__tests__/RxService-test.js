import RxService from '../RxService'

describe('test RxService', () => {

    it('state$ should work', () => {
        const service = new RxService({ state: { num: 1 }})
        let count = 0
        service.state$.subscribe(data => (count = data.num))

        expect(count).toBe(1)
        service.setState({ num: 2 })
        expect(count).toBe(2)
    })

})
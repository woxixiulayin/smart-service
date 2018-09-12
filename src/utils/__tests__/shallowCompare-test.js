import shallowCompare from '../shallowCompare'

describe('test shallowCompare', () => {

    it('should check base type', () => {

        expect(shallowCompare(0, 0)).toBeTruthy()
        expect(shallowCompare(0, 1)).toBeFalsy()

        expect(shallowCompare('test', 'test')).toBeTruthy()
        expect(shallowCompare('test', 'tttt')).toBeFalsy()

        expect(shallowCompare(null, null)).toBeTruthy()
        expect(shallowCompare(undefined, undefined)).toBeTruthy()

        // +0 -0不相等
        expect(shallowCompare(+0, -0)).toBeFalsy()
        // NAN 浅比较相等
        expect(shallowCompare(NaN, NaN)).toBeTruthy()
    })

    it('should test object', () => {
        let a1 = {name: 'a', length: 1},
            a2 = {name: 'a', length: 1},
            b = {name: 'b', length: 1}
        expect(shallowCompare(a1, a2)).toBeTruthy()
        expect(shallowCompare(a1, b)).toBeFalsy()
    })
})
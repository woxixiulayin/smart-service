import injectService from '../injectService'
import * as React from 'react'
import Service from '../Service'

describe('test injectService', () => {

    class Dependency extends Service<string> {
        constructor() {
            const state = 'dependency'
            super({ state })
        }
    }

    it('should inject service instance into Service', () => {
        @injectService(Dependency)
        class Test extends Service<string> {
            constructor() {
                const state = 'test'
                super({ state })
            }
        }

        const test = new Test()

        expect(test.dependency instanceof Dependency).toBeTruthy()
    })
})
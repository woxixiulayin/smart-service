// @flow

import injectService from '../injectService'
import * as React from 'react'
import Service from '../Service'

describe('test injectService', () => {

    class DependencyA extends Service<string> {
        constructor() {
            const state = 'dependencyA'
            super({ state })
        }
    }
    class DependencyB extends Service<string> {
        constructor() {
            const state = 'dependencyB'
            super({ state })
        }
    }

    it('should inject Dependency instance into Test as constructor param ', () => {
        @injectService(DependencyA, DependencyB)
        class Test extends Service<strinsg> {
            constructor(dependencyA, dependencyB) {
                const state = 'test'
                super({ state })
                this.dependencyA = dependencyA
                this.dependencyB = dependencyB
            }
        }

        const test = new Test()

        expect(test.getState()).toBe('test')
        expect(test.dependencyA.getState()).toBe('dependencyA')
        expect(test.dependencyB.getState()).toBe('dependencyB')
    })
})
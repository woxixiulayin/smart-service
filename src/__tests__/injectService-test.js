// @flow

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

    it('should inject Dependency instance into Test as constructor param ', () => {
        @injectService(Dependency)
        class Test extends Service<strinsg> {
            constructor(dependency) {
                const state = 'test'
                super({ state })
                this.dependency = dependency
            }
        }

        const test = new Test()

        expect(test.getState()).toBe('test')
        expect(test.dependency.getState()).toBe('dependency')
    })
})
## About
> 一个小的数据管理框架，以Service的概念将数据与数据操作集合在一个个Service类内。将程序中的业务逻辑拆分成一个个小的Service，然后通过依赖注入将数据及实例注入到组件中。解决redux代码繁琐，数据与操作逻辑分散，不同数据模型间无法直接沟通的问题。同时鼓励将service(业务逻辑)拆分，不用通过一个中心store来预先申明项目中的所有service，配合依赖注入，可以使得业务逻辑部分代码的拆分、复用、按需加载都变得比较轻松。
-----

[![Build Status](https://travis-ci.org/woxixiulayin/smart-service.svg?branch=master)](https://travis-ci.org/woxixiulayin/smart-service)[![Coverage Status](https://coveralls.io/repos/github/woxixiulayin/smart-service/badge.svg?branch=master)](https://coveralls.io/github/woxixiulayin/smart-service?branch=master)

-----
## Service类

- 所有定义的Service都不用主动实例化，系统会通过依赖关系自动创建对应的实例，且每一个类都只会存在唯一单例。
- state: Service类的内部数据，代码某一服务相关的数据。在实际编码中注意使用泛型Service<T>来定义state的类型会可以提供代码提示，方便不少。
- _produceState: 继承自Service基类的方法，是唯一可以修改state的方法，一个Service类的state只能通过_produceState方法来修改，且外部不能直接调用，应该使用封装好的Service方法来操作。
    > _produceState内部使用了[immer](https://github.com/mweststrate/immer)中的produce方法，使得immutable的操作可以通过mutable的形式实现，这样避免了繁琐的手动返回新对象的操作。
- subscribe: 继承自Service基类的方法，用于外部订阅state的变化。实际应用中主要使用withService自动绑定service的state到组件中。

```javascript
export type typeTodo = {
    id: number,
    done: boolean,
    content: string,
}


export type typeTodoState = {
    todoByIds: {
        [key: number]: typeTodo
    }
}

/**
 * 创建项目中的业务逻辑，继承自Service
 * 1、在构造函数中定义state的初始值
 * 2、定义方法（不用区分同步异步）来修改state
 */
export default class TodoService extends Service<typeTodoState> {
    constructor() {
        super({
            state: {
                todoByIds: {},
            }
        })
    }

    createTodo(content: string): typeTodo {
        const id = Object.keys(this.getState().todoByIds).length
        const todo = {
            done: false,
            content,
            id
        }

        return todo
    }

    // 提供给外部的添加todo的方法
    // 通过_produceState来修改内部的state，提供add方法给外部调用
    add(content: string) {
        // 内部使用了immer的produce，可以直接操作state，返回新的state
        this._produceState(state => {
            const todo = this.createTodo(content)
            state.todoByIds[todo.id] = todo
        })
    }

    // 将todo标记成已完成 
    done(id: number, done: boolean) {
        this._produceState(state => {
            state.todoByIds[id] && (state.todoByIds[id].done = done)
        })
    }

    // 删除todo
    delete(id: number) {
        this._produceState(state => {
            delete state.todoByIds[id]
        })
    }
}
```

- RxService: 在实时应用或service状态有依赖的情况中使用会更加便捷。因为这种分拆的service结构在各自的逻辑内依赖其他service比较方便，不会影响其他业务和组件。

---------

## 两个关键的api
-----

### withService

- withService可以接收三个参数，第一个参数是组件依赖的类，第二个参数（可选）是一个函数表示从类的state到组件props的映射，第三个参数（可选）设置组件props中对应的service的键名
(相当于react-redux中的mapStateToProps)
- 每次该类实例的state发生变化都会触发组件相应props的变化
- 依赖注入：withService会根据当前系统中是否存在对应的实例来创建，保证系统只存在唯一一个单例。也就是说不用主动实例化服务。组件挂载时会自动根据需要创建所依赖的实例。
- withService会额外传递一个类的实例给组件的props，组件就获得了相应Servcie的参数方法。实例的名字是对应的驼峰命**TodoService -> todoService**（或者通过设置第三个参数来主动设置）。这样服务与组件可以组合或单独复用到不同的页面。组件内部可以直接调用服务实例的方法，而具体注入的服务可以在使用时选择（比如在不同地方使用同一组件时，分别注入具有同样接口的服务）。
- 如果一个组件依赖多个Service，可以将多个withService叠加使用，或者使用compose方法

```javascript
// 注入TodoService服务，可以叠加withService来注入多个服务
@withService(TodoService, (state: typeTodoState, ownProps) => ({
    todo: state.todoByIds[ownProps.id]
}))
class TodoItem extends React.Component<{ todo: typeTodo, todoService: TodoService }> {

    toggleDone = () => {
        // use props and todoService instance injected by withService
        const { todo, todoService } = this.props

        // 使用todoService的方法
        todoService.done(todo.id, !todo.done)
    }

    render() {
        const { todo } = this.props

        return <div className={`todo-item ${todo.done ? 'line-through' : ''}`}>
            <input onClick={this.toggleDone} type="checkbox" />
            <span className="todo-item-id">{ todo.id }</span>
            <span className={`todo-item-content`}>{ todo.content }</span>
        </div>
    }
}
```

-----

### injectService
- 当一个Service依赖其他Service state的变化或者需要调用其他服务的方法时，可以通过injectService注入其他Service。此时被依赖的Service的实例会依次作为此Service的改构造函数的参数。当然这些Service的实例也是根据需要自动创建的。

```javascript
// 一个injectService的测试代码
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
```
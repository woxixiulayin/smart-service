## About
    一个小的数据管理框架，以Service类的形式将数据与数据操作集合在一个个Service Class内，将程序中拆分成一个个小的Service，然后通过赖注入将数据及类实例注入到组件中。解决redux代码繁琐，数据与操作逻辑分散，不同数据模型间无法直接沟通的问题。同时鼓励将service拆分，不用通过一个中心store来组装所有的service，配合依赖注入，可以使得Y业务逻辑部分代码的拆分、复用、自动加载都变得比较轻松。

## Service类
- 所有定义的Service都不用主动实例化，系统会通过依赖关系自动创建对应的实例，且每一个类都只会存在唯一单例。
- state: Service类的内部数据，代码某一服务相关的数据。在实际编码中注意使用泛型Service<T>来定义state的类型会方便不少。
- _produceState: 继承自Service基类的方法，是唯一可以修改state的方法，一个Service类的state只能通过_produceState方法来修改，且外部不能直接调用，应该使用封装好的"action"来操作。
    > _produceState内部使用了[immer](https://github.com/mweststrate/immer)中的produce方法，使得immutable的操作可以通过mutable的形式实现，这样避免了繁琐的手动返回新对象的操作。
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

    // 通过_produceState来修改内部的state，提供add方法给外部调用
    add(content: string) {
        // 内部使用了immer的produce，可以直接操作state，返回新的state
        this._produceState(state => {
            const todo = this.createTodo(content)
            state.todoByIds[todo.id] = todo
        })
    }
    
    done(id: number, done: boolean) {
        this._produceState(state => {
            state.todoByIds[id] && (state.todoByIds[id].done = done)
        })
    }

    delete(id: number) {
        this._produceState(state => {
            delete state.todoByIds[id]
        })
    }
}
```

## 几个关键的api

### withService

- withService接收两个参数，第一个参数是组件依赖的类，第二个参数是一个函数表示从类的state到组件props的映射
- 每次该类实例的state发生变化都会触发组件相应props的变化
- withService会根据当前是否存在对应的实例来创建实例，保证系统只存在唯一一个单例。也就是说不用主动实例化服务，服务是提供给组件使用的。组件挂载时会自动创建所依赖的实例。这样的服务与组件可以组合或单独复用到不同的页面。
- withService会额外传递一个类的实例给组件的props，组件就获得了相应Servcie的参数方法。实例的名字是对应的驼峰命**TodoService -> todoService**
- 如果一个组件依赖多个Service，可以将多个withService叠加使用，或者使用compose方法

```javascript
@withService(TodoService, (state: typeTodoState, ownProps) => ({
    todo: state.todoByIds[ownProps.id]
}))
class TodoItem extends React.Component<{ todo: typeTodo, todoService: TodoService }> {

    toggleDone = () => {
        // use props and todoService instance injected by withService
        const { todo, todoService } = this.props

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

### injectService
当一个Service依赖其他Service时，可以用过injectService注入其他Service的实例。此时被依赖的Service的实例会依次作为此Service的改构造函数的参数。

```javascript
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
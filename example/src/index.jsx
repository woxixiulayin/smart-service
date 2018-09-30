// @flow
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import TodoService from './TodoService'
import type { typeTodo, typeTodoState } from './TodoService'
import { withService, Service } from '../../src'
import TodoList from './TodoList'


// use decorator to connect component with service, you can also use normal function (see TodoList.jsx)
@withService(TodoService)
class App extends React.Component<{
    todoService: TodoService,
}>{

    input: HTMLInputElement

    addItem = () => {
        const { todoService } = this.props
        todoService.add(this.input.value)
        this.input.value = ''
    }

    onInputKeyDown = e => {

        const keyCode = e.keyCode || e.which || e.charCode
        const ctrlKey = e.ctrlKey || e.metaKey
        if (keyCode === 13) {
            e.preventDefault()
            if (ctrlKey) {
                e.target.value += '\r'
            } else {
                this.addItem()
            }
        }
    }

    render() {

        return (
            <section className="todo-list-container">
                <h1>todo list</h1>
                <div className="todo-list-input">
                    <input
                      ref={node => (this.input = node)}
                      autoFocus
                      type="text"
                      onKeyDown={this.onInputKeyDown}
                    />
                    <button onClick={this.addItem}>添加</button>
                </div>
                <TodoList />
            </section>
        )
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
)

// for debug purpose
window.service = Service.serviceMap
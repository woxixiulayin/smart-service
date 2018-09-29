// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import TodoService, { typeTodo, typeTodoState } from './TodoService'
import { withService, Service } from '../../src'
import TodoItem from './TodoItem'

@withService(TodoService, (state: typeTodoState) => ({
    todoIds: Object.keys(state.todoByIds)
}))
class App extends React.Component<{
    todoService: TodoService,
    todoIds: [number]
}>{

    onInputKeyDown = e => {
        const { todoService } = this.props

        const keyCode = e.keyCode || e.which || e.charCode
        const ctrlKey = e.ctrlKey || e.metaKey
        if (keyCode === 13) {
            e.preventDefault()
            if (ctrlKey) {
                e.target.value += '\r'
            } else {
                todoService.add(e.target.value)
                e.target.value = ''
            }
        }
    }

    render() {

        return (
            <section className="todo-list-container">
                <h1>todo list</h1>
                <input type="text" onKeyDown={this.onInputKeyDown} />
                <ul>
                    {this.props.todoIds.map(id => <li key={id}>
                            <TodoItem id={id} />
                        </li>)}
                </ul>
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
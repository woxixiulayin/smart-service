// @flow

import * as React from 'react'
import ReactDOM from 'react-dom'
import TodoService, { typeTodo, typeTodoState } from './TodoService'
import { withService, Service } from '../../src'
import TodoItem from './TodoItem'

@withService(TodoService, (state: typeTodoState) => ({
    todoIds: Object.keys(state.todoByIds)
}))
class App extends React.Component{
    render() {

        return (
            <section className="todo-list-container">
                <h1>todo list</h1>
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
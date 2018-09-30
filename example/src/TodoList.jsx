// @flow

import * as React from 'react'
import TodoService from './TodoService'
import type { typeTodo, typeTodoState } from './TodoService'
import { withService, Service } from '../../src'
import TodoItem from './TodoItem'

const TodoList = ({ todoIds = [], countOfDone = 0 }) => <div className="todo-list">
    <div className="todo-list-info">
        <span>total: {todoIds.length} </span>
        <span>done: {countOfDone} </span>
    </div>
    <ul>
    {todoIds.map(id => <li key={id}>
            <TodoItem id={id} />
        </li>)}
    </ul>
</div>

const mapStateToProps = (state: typeTodoState) => ({
    todoIds: Object.keys(state.todoByIds),
    countOfDone: Object.values(state.todoByIds).filter((item: typeTodo) => item.done).length
})

// export smart component with Service
export default withService(TodoService, mapStateToProps)(TodoList)

// export dumb component: can use for testing or connected with different service
export {
    TodoList
}
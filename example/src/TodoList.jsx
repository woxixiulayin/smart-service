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

// 使用普通函数的方式，对外export已经连接了service的组件，即smart组件，这种方式还可以让TodoList组件单独export用作单元测试或者连接其他服务
export default withService(TodoService, mapStateToProps)(TodoList)

// 单独export dumb组件:用作单元测试或者连接其他服务
export {
    TodoList
}
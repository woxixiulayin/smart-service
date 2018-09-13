import * as React from 'react'
import { withService } from '../../src'
import TodoService, { typeTodo, typeTodoState } from './TodoService'


// inject todoservice Instance and mapState to component
@withService(TodoService, (state: typeTodoState, ownProps) => ({
    todo: state.todoByIds[ownProps.id]
}))
class TodoItem extends React.Component<{ todo: typeTodo, todoservice: TodoService }> {

    toggleDone = () => {
        const { todo, todoservice } = this.props

        todoservice.done(todo.id, !todo.done)
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

export default TodoItem
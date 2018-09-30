import * as React from 'react'
import { withService } from '../../src'
import TodoService from './TodoService'
import type { typeTodo, typeTodoState } from './TodoService'


// inject todoservice Instance and mapState to component
@withService(TodoService, (state: typeTodoState, ownProps) => ({
    todo: state.todoByIds[ownProps.id]
}))
class TodoItem extends React.Component<{ todo: typeTodo, todoService: TodoService }> {

    toggleDone = () => {
        const { todo, todoService } = this.props
        
        todoService.done(todo.id, !todo.done)
    }
    
    deleteItem = () => {
        const { todo, todoService } = this.props

        todoService.delete(todo.id)
    }

    render() {
        const { todo } = this.props

        return <div className={`todo-item ${todo.done ? 'line-through' : ''}`}>
           <button onClick={this.deleteItem}>删除</button>
            <input onClick={this.toggleDone}  checked={todo.done} type="checkbox" />
            <span className={`todo-item-content`}>{ todo.content }ddd</span>
        </div>
    }
}

export default TodoItem
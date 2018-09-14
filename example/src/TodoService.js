// @flow
import { Service } from '../../src'

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

    add(content: string) {
        this.setState(state => {
            const todoByIds = {...state.todoByIds}
            const todo = this.createTodo(content)
            todoByIds[todo.id] = todo
            return { todoByIds }
        })
    }
    
    done(id: number, done: boolean) {
        this.setState(state => {
            const todoByIds = {...state.todoByIds, [id]: {...state.todoByIds[id], done }}
            return { todoByIds }
        })
    }

    delete(id: number) {
        this.setState(state => {
            const todoByIds = { ...state.todoByIds }
            delete todoByIds[id]
            return { todoByIds }
        })
    }
}

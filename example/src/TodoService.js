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

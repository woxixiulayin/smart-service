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
    },
    historyCount: number
}


const TODO_LIST = 'TODO_LIST'
const HISTORY_COUNT = 'HISTORY_COUNT'
const getLocalData = (key: string): any => JSON.parse(localStorage.getItem(key) || '{}')
const saveLocalData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data))

/**
 * service是独立的业务逻辑模块，通过withService注入组件。
 * 任何有关todo的操作和逻辑都可以写在这里，避免在组件中操作公共数据，或者在每个组件中重复写一些通用的方法
 * 比如利用浏览器缓存todolist这块逻辑就可以很方便的在TodoService中实现，而不用关心具体组件
 */
export default class TodoService extends Service<typeTodoState> {
    constructor() {
        super({
            state: {
                todoByIds: getLocalData(TODO_LIST),
                historyCount: getLocalData(HISTORY_COUNT)
            }
        })
    }

    createTodo(content: string): typeTodo {
        const id = this.getState().historyCount + 1
        const todo = {
            done: false,
            content,
            id
        }

        return todo
    }

    // 在service中独立加入存入localStorage的逻辑，不影响组件
    updateState = updater => {
        this._produceState(updater)
        saveLocalData(TODO_LIST, this.getState().todoByIds)
        saveLocalData(HISTORY_COUNT, this.getState().historyCount)
        console.log(this.getState())
    }

    add(content: string) {
        this.updateState(state => {
            const todo = this.createTodo(content)
            state.todoByIds[todo.id] = todo
            state.historyCount += 1
        })
    }
    
    done(id: number, done: boolean) {
        this.updateState(state => {
            state.todoByIds[id] && (state.todoByIds[id].done = done)
        })
    }

    delete(id: number) {
        this.updateState(state => {
            delete state.todoByIds[id]
        })
    }
}

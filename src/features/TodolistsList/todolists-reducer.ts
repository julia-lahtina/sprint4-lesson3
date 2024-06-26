import { todolistsAPI, TodolistType } from '../../api/todolists-api'
import { Dispatch } from 'redux'
import { RequestStatusType, setAppError, setAppErrorType, setStatusLoading, setStatusLoadingType } from '../../app/app-reducer'
import { handleNetworkError } from '../../utils/error-utils'

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{ ...action.todolist, filter: 'all', entityStatus: 'idle' }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? { ...tl, title: action.title } : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? { ...tl, filter: action.filter } : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
        case 'SET-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? { ...tl, entityStatus: action.entityStatus } : tl)
        default:
            return state
    }
}

// actions
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST', id } as const)
export const addTodolistAC = (todolist: TodolistType) => ({ type: 'ADD-TODOLIST', todolist } as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: 'SET-TODOLISTS', todolists } as const)
export const setEntityStatus = (id: string, entityStatus: RequestStatusType) => ({ type: 'SET-ENTITY-STATUS', id, entityStatus } as const)


// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setStatusLoading('succeeded'))
                dispatch(setTodolistsAC(res.data))
            })
            .catch((e) => {
                handleNetworkError(dispatch, e)
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoading('loading'))
        dispatch(setEntityStatus(todolistId, 'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(setStatusLoading('succeeded'))
                dispatch(removeTodolistAC(todolistId))
            })
            .catch((e) => {
                handleNetworkError(dispatch, e)
                dispatch(setEntityStatus(todolistId, 'idle'))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoading('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppError(res.data.messages[0]))
                    } else {
                        dispatch(setAppError('Something went wrong'))
                    }
                }
                dispatch(setStatusLoading('succeeded'))
            })
            .catch((e) => {
                handleNetworkError(dispatch, e)
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setStatusLoading('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setStatusLoading('succeeded'))
            })
            .catch((e) => {
                handleNetworkError(dispatch, e)
            })
    }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type setEntityStatusType = ReturnType<typeof setEntityStatus>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | setStatusLoadingType
    | setAppErrorType
    | setEntityStatusType

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

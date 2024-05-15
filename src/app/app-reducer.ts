export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


// types
export type setStatusLoadingType = ReturnType<typeof setStatusLoading>
export type setAppErrorType = ReturnType<typeof setAppError>

type ActionsType = setStatusLoadingType | setAppErrorType



// reducer
const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        case "APP/SET-APP-ERROR":
            return { ...state, error: action.error }
        default:
            return state
    }
}



// action
export const setStatusLoading = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const)
export const setAppError = (error: string | null) => ({ type: 'APP/SET-APP-ERROR', error } as const)


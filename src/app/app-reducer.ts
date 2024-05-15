export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


// types

export type setStatusLoadingType = ReturnType<typeof setStatusLoading>
type ActionsType = setStatusLoadingType



// reducer

const initialState = {
    status: 'loading' as RequestStatusType,
}

type InitialStateType = typeof initialState

export const appReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state, status: action.status }
        default:
            return state
    }
}



// action

export const setStatusLoading = (status: RequestStatusType) => ({ type: 'APP/SET-STATUS', status } as const)


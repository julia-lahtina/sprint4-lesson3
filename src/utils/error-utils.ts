import { Dispatch } from "redux"
import { setAppError, setStatusLoading } from "../app/app-reducer"
import { ResponseType } from "../api/todolists-api"

export const serverNetworkError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Something went wrong'))
    }
    dispatch(setStatusLoading('failed'))
}




export const handleNetworkError = (dispatch: Dispatch, e: { message: string }) => {
    dispatch(setAppError(e.message))
    dispatch(setStatusLoading('failed'))
}
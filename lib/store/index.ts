import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../slices/auth'
import CartReducer from '../slices/cart'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: UserReducer,
            cart: CartReducer,
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()

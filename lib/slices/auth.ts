import { User } from '@/prisma/generated/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSlice {
    user: User | undefined,
    loading: boolean
}

const initialState: UserSlice = {
    user: undefined,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | undefined>) => {
            state.user = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        logoutClient: (state) => {
            state.user = undefined;
        }
    }
});


export const { setUser, logoutClient } = userSlice.actions;
const UserReducer = userSlice.reducer;
export default UserReducer;

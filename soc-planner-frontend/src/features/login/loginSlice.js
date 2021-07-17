import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    login: false
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload
        }
    }
})

export const { setLogin } = loginSlice.actions
export const selectLogin = (state) => state.login.login

export default loginSlice.reducer
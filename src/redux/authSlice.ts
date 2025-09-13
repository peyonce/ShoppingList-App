import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
        loadUser: (state) => {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                state.user = JSON.parse(savedUser);
                state.isAuthenticated = true;
            }
        },
    },
});

export const { login, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;

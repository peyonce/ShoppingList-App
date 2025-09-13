import { configureStore } from "@reduxjs/toolkit";
import shoppingListReducer from "../redux/shoppingListSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    shoppingList: shoppingListReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

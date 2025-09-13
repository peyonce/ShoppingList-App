import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ShoppingItem {
  id: number;
  name: string;
}

interface ShoppingListState {
  items: ShoppingItem[];
}

const initialState: ShoppingListState = {
  items: [],
};

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index].name = action.payload.name;
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setItems, addItem, updateItem, deleteItem } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;

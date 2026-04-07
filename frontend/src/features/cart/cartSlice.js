import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        existItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      state.totalAmount += item.price;
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(item => item._id === id);
      if (existingItem) {
         state.totalAmount -= existingItem.price * existingItem.quantity;
         state.cartItems = state.cartItems.filter((x) => x._id !== id);
      }
    },
    updateQuantity: (state, action) => {
       const { id, quantity } = action.payload;
       const item = state.cartItems.find(item => item._id === id);
       if (item) {
           state.totalAmount -= item.price * item.quantity;
           item.quantity = quantity;
           state.totalAmount += item.price * item.quantity;
       }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;

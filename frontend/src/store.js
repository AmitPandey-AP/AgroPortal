import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import predictionReducer from './features/prediction/predictionSlice';

// --- localStorage persistence helpers ---
const CART_KEY = 'agro_cart';

const loadCartFromStorage = () => {
  try {
    const serialized = localStorage.getItem(CART_KEY);
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartState));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
};

// Preload cart state from localStorage so it survives page reloads / Stripe redirects
const preloadedState = {
  cart: loadCartFromStorage(),
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    prediction: predictionReducer,
  },
  preloadedState,
});

// Subscribe to store changes and persist only the cart slice
store.subscribe(() => {
  saveCartToStorage(store.getState().cart);
});

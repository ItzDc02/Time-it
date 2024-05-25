// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import capsuleReducer from "../Features/Capsule/capsuleSlice";
import userReducer from "../Features/Users/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    capsule: capsuleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

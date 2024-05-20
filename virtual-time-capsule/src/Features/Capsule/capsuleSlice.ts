// src/features/capsule/capsuleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CapsuleState {
  capsules: { id: string; title: string; date: string; message: string }[];
}

const initialState: CapsuleState = {
  capsules: [],
};

const capsuleSlice = createSlice({
  name: "capsule",
  initialState,
  reducers: {
    addCapsule: (
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        date: string;
        message: string;
      }>
    ) => {
      state.capsules.push(action.payload);
    },
    removeCapsule: (state, action: PayloadAction<string>) => {
      state.capsules = state.capsules.filter(
        (capsule) => capsule.id !== action.payload
      );
    },
  },
});

export const { addCapsule, removeCapsule } = capsuleSlice.actions;
export default capsuleSlice.reducer;

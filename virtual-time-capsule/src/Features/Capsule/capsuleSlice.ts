// src/features/capsule/capsuleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Capsule {
  id: string;
  title: string;
  date: string;
  message: string;
}

interface CapsuleState {
  capsules: Capsule[];
}

const initialState: CapsuleState = {
  capsules: JSON.parse(localStorage.getItem("capsules") || "[]"),
};

const capsuleSlice = createSlice({
  name: "capsule",
  initialState,
  reducers: {
    addCapsule: (state, action: PayloadAction<Capsule>) => {
      state.capsules.push(action.payload);
      localStorage.setItem("capsules", JSON.stringify(state.capsules));
    },
    removeCapsule: (state, action: PayloadAction<string>) => {
      state.capsules = state.capsules.filter(
        (capsule) => capsule.id !== action.payload
      );
      localStorage.setItem("capsules", JSON.stringify(state.capsules));
    },
  },
});

export const { addCapsule, removeCapsule } = capsuleSlice.actions;
export default capsuleSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth"; // Importing the User type from Firebase for reference only

interface SerializableUser {
  uid: string | null;
  email: string | null;
  displayName: string | null;
}

interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializableUser | null>) => {
      if (action.payload) {
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
      } else {
        state.uid = null;
        state.email = null;
        state.displayName = null;
      }
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

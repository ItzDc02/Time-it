import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export interface Capsule {
  id: string;
  title: string;
  date: string;
  message: string;
}

interface CapsuleState {
  capsules: Capsule[];
}

const initialState: CapsuleState = {
  capsules: [],
};

export const fetchCapsules = createAsyncThunk(
  "capsule/fetchCapsules",
  async (userUid: string) => {
    if (!userUid) {
      console.log("fetchCapsules: No user UID provided");
      return [];
    }

    console.log("Fetching capsules for user:", userUid);
    const querySnapshot = await getDocs(
      collection(db, "users", userUid, "capsules")
    );
    const capsules = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Capsule data:", data);
      return {
        id: doc.id,
        title: data.title || "Default Title",
        date: data.date || "No Date",
        message: data.message || "No Message",
      };
    });

    return capsules;
  }
);

const capsuleSlice = createSlice({
  name: "capsule",
  initialState,
  reducers: {
    addCapsule: (state, action: PayloadAction<Capsule>) => {
      state.capsules.push(action.payload);
    },
    removeCapsule: (state, action: PayloadAction<string>) => {
      state.capsules = state.capsules.filter(
        (capsule) => capsule.id !== action.payload
      );
    },
    setCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.capsules = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCapsules.fulfilled, (state, action) => {
      console.log("Capsules fetched and setting state", action.payload);
      state.capsules = action.payload;
    });
  },
});

export const { addCapsule, removeCapsule, setCapsules } = capsuleSlice.actions;
export default capsuleSlice.reducer;

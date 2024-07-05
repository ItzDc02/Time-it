import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export interface Capsule {
  id: string;
  title: string;
  date: string;
  message: string;
  fileUrls?: string[];
  ownerEmail?: string;
  ownerUid?: string;
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
      return [];
    }

    const querySnapshot = await getDocs(
      collection(db, "users", userUid, "capsules")
    );
    const capsules = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Default Title",
        date: data.date || "No Date",
        message: data.message || "No Message",
        fileUrls: data.fileUrls || [], // Ensure this is correctly handled
        ownerEmail: data.ownerEmail,
        ownerUid: userUid, // Ensure ownerUid is set
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
      state.capsules = action.payload;
    });
  },
});

export const { addCapsule, removeCapsule, setCapsules } = capsuleSlice.actions;
export default capsuleSlice.reducer;

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

// Async thunk for fetching capsules from Firestore
export const fetchCapsules = createAsyncThunk(
  "capsule/fetchCapsules",
  async (_, { dispatch }) => {
    const querySnapshot = await getDocs(collection(db, "capsules"));
    const capsules = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Ensure that data contains all the properties expected by the Capsule interface
      return {
        id: doc.id,
        title: data.title || "Default Title", // Provide default values or handle missing data appropriately
        date: data.date || "No Date",
        message: data.message || "No Message",
      };
    });
    dispatch(setCapsules(capsules));
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
  //@ts-ignore
  extraReducers: (builder) => {
    // builder.addCase(fetchCapsules.fulfilled, (state, action) => {
    //   // This is handled by dispatching setCapsules inside the thunk
    // });
  },
});

export const { addCapsule, removeCapsule, setCapsules } = capsuleSlice.actions;
export default capsuleSlice.reducer;

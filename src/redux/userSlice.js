import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail: (state, action) => {
      // console.log(action.payload);
      state.value = action.payload;
    },
    removeToken: (state) => {
      state.value = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUserDetail, removeToken } = userSlice.actions;
export default userSlice.reducer;

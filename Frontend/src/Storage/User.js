import { createSlice } from '@reduxjs/toolkit';

// Load saved user from localStorage
const savedUser = localStorage.getItem("userdata")
  ? JSON.parse(localStorage.getItem("userdata"))
  : null;

const initialState = {
  status: !!savedUser,
  userdata: savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userdata = action.payload;
      localStorage.setItem("userdata", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.status = false;
      state.userdata = null;
      localStorage.removeItem("userdata");
      
      
      localStorage.removeItem("cart");
    },
  },
});


export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
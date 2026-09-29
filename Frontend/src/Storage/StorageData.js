import { configureStore } from '@reduxjs/toolkit';
import authReducer from './User.js'
import  Productreducer  from "./Product"

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: Productreducer,
  },
});

export default store;
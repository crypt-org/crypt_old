import { configureStore } from "@reduxjs/toolkit";
import serviceReducer from "./config/Services";

const store = configureStore({
  reducer: {
    services: serviceReducer
  }
});

export default store;
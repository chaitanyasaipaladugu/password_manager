import { configureStore } from "@reduxjs/toolkit";
import passwordsReducer from "./passwordsSlice";

export const store = configureStore({
  reducer: {
    passwords: passwordsReducer,
  },
});

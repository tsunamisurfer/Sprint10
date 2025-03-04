import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./filtersSlice.js";
import { pizzaApi } from "./pizzaApi.js";

// const exampleReducer = (state = { count: 0 }) => {
//   return state
// } import the reducer from pizzaSlice.js instead

export const resetStore = () =>
  configureStore({
    reducer: {
      filters: filtersReducer,
      [pizzaApi.reducerPath]: pizzaApi.reducer,
      // add your reducer(s) here
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pizzaApi.middleware),
    // if using RTK Query for your networking: add your middleware here
    // if using Redux Thunk for your networking: you can ignore this
  });

export const store = resetStore();

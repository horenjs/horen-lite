/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 21:02:47
 * @LastEditTime : 2022-06-08 21:43:29
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-ts\src\store\index.ts
 * @Description  : 
 */
import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/couter.slice";

const store = configureStore({
  reducer: {
    counter: counterSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
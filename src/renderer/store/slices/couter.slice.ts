/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-06-08 21:05:19
 * @LastEditTime : 2022-06-08 21:43:27
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \react-ts\src\store\slices\couter.slice.ts
 * @Description  :
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export const incrementByAmountAsync = (amount: number) => dispatch => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

export default counterSlice.reducer;

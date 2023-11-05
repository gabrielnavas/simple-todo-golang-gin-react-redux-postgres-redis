import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incremenetByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

export const { incremenetByAmount, increment, decrement } = counterSlice.actions

export default counterSlice.reducer
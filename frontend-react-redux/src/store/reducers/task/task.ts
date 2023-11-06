import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Task = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
}


type TasksState = {
  tasks: Task[]
}

const initialState: TasksState = {
  tasks: []
}

export const taskSlice = createSlice({
  name: 'task',
  initialState: {...initialState},
  reducers: {
    addTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
  }
})

export const { addTasks } = taskSlice.actions

export default taskSlice.reducer
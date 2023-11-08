import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Task = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
}


type TasksState = {
  tasks: Task[]
  loadingData: boolean
}

const initialState: TasksState = {
  tasks: [],
  loadingData: false
}

export const taskSlice = createSlice({
  name: 'task',
  initialState: {...initialState},
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks = [action.payload].concat(state.tasks)
    },
    setLoadingData: (state, action: PayloadAction<boolean>) => {
      state.loadingData = action.payload
    }
  }
})

export const { addTask, setTasks, setLoadingData } = taskSlice.actions

export default taskSlice.reducer
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
    updatePartialsTask: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.map(task => {
        if(task.id === action.payload.id) {
          return action.payload
        }
        return task
      })
    },
    setLoadingData: (state, action: PayloadAction<boolean>) => {
      state.loadingData = action.payload
    }
  }
})

export const { addTask, setTasks, updatePartialsTask, setLoadingData } = taskSlice.actions

export default taskSlice.reducer
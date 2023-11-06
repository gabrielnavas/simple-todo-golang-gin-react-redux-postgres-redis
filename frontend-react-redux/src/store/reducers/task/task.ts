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
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const tasks = state.tasks.map(t => t as Task).concat([action.payload])
      state.tasks = tasks
    },
  }
})

export const { addTask, setTasks } = taskSlice.actions

export default taskSlice.reducer
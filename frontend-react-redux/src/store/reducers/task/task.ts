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
      // const newTasks: Task[] = [] 
      // for (let task of action.payload) {
      //   if (state.tasks.find(t => t.id === task.id) === undefined) {
      //     newTasks.push(task)
      //   }
      // }
      state.tasks = action.payload
    },
  }
})

export const { addTasks } = taskSlice.actions

export default taskSlice.reducer
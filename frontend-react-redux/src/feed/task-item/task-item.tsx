

import moment from 'moment'

import { 
  ThreeDotsMenu,
  ThreeDotsMenuIcon,
  ShowDate,
  Task,
  TaskContent,
  TaskHeader,
  TaskHeaderLeft,
  TaskHeaderRight
} from './material-components'

type Task = {
  id: string
  description: string
  createdAt: Date
  updatedAt: Date
}

type Props = {
  taskData: Task
}

export const TaskItem = ({ taskData }: Props) => {
  return (
    <Task>
      <TaskHeader>
        <TaskHeaderLeft>
          <ShowDate> Criado em {moment(taskData.createdAt).format('DD/MM/YYYY, h:mm:ss a') }</ShowDate>
          <ShowDate> Atualizado em {moment(taskData.updatedAt).format('DD/MM/YYYY, h:mm:ss a') }</ShowDate>
        </TaskHeaderLeft>
        <TaskHeaderRight>
          <ThreeDotsMenu aria-label="settings">
            <ThreeDotsMenuIcon />
          </ThreeDotsMenu>
        </TaskHeaderRight>
      </TaskHeader>
      <TaskContent>
        {taskData.description} 
      </TaskContent>
    </Task>
  )
}
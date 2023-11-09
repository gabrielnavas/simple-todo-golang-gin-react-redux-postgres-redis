import moment from 'moment'

import { 
  ShowDate,
  Task,
  TaskContent,
  TaskHeader,
  TaskHeaderLeft,
  TaskHeaderRight
} from './material-components'

import { TaskItemMenu } from './task-item-menu'
import { UpdateTaskModal } from '../update-task-modal /update-task-modal'
import { useState } from 'react'

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
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const showUpdatedAt = taskData.createdAt.toISOString() !== taskData.updatedAt.toISOString() 
  && (
    <ShowDate> 
      Atualizado em {moment(taskData.updatedAt).format('DD/MM/YYYY, h:mm:ss a') }
    </ShowDate>
  )

  return (
    <Task>
      <TaskHeader>
        <TaskHeaderLeft>
          <ShowDate> 
            Criado em {moment(taskData.createdAt).format('DD/MM/YYYY, h:mm:ss a') }
          </ShowDate>
          { showUpdatedAt }
        </TaskHeaderLeft>
        <TaskHeaderRight>
          <TaskItemMenu
            onClickUpdateButton={() => setModalIsOpen(true)}
          />
        </TaskHeaderRight>
      </TaskHeader>
      <TaskContent>
        {taskData.description} 
      </TaskContent>

      <UpdateTaskModal 
        isOpen={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        taskToUpdate={taskData} />
    </Task>
  )
}
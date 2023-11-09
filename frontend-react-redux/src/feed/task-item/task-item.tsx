import { useState } from 'react'

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
import { UpdateTaskModal } from '../update-task-modal/update-task-modal'
import { RemoveTaskModal } from '../remove-update-task-modal/remove-task-modal'

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
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false)
  const [modalRemoveIsOpen, setModalRemoveIsOpen] = useState(false)

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
            onClickOpenModalUpdateTask={() => setModalUpdateIsOpen(true)} 
            onClickOpenModalRemoveTask={() => setModalRemoveIsOpen(true)} />
        </TaskHeaderRight>
      </TaskHeader>
      <TaskContent>
        {taskData.description} 
      </TaskContent>


      <RemoveTaskModal 
        isOpen={modalRemoveIsOpen}
        closeModal={() => setModalRemoveIsOpen(false)}
        taskToUpdate={taskData} />

      <UpdateTaskModal 
        isOpen={modalUpdateIsOpen}
        closeModal={() => setModalUpdateIsOpen(false)}
        taskToUpdate={taskData} />
    </Task>
  )
}
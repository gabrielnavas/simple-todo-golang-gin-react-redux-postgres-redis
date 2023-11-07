import { useState } from "react"

import { useSelector } from "react-redux"

import { CreateTaskModal } from "../create-task-modal/create-task-modal"
import { 
  Container, 
  CreateTaskButton, 
  AddTaskIcon
} from "./material-components"

import { RootState } from "../../store/store"

export const FeedHeader = () => {
  const taskState = useSelector((state: RootState) => state.task)

  const [openModal, setOpenModal] = useState(false)

  return (
    <Container>
      <CreateTaskButton 
        disabled={taskState.loadingData}
        variant="contained"
        onClick={() => setOpenModal(!openModal)}>
        <AddTaskIcon />
        Task
      </CreateTaskButton>

      <CreateTaskModal 
        isOpen={openModal} 
        closeModal={() => setOpenModal(false)} />
    </Container>
  )
}
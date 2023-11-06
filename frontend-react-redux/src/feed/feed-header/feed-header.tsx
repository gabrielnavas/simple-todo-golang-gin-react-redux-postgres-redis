import { useState } from "react"
import { CreateTaskModal } from "../create-task-modal/create-task-modal"
import { 
  Container, 
  CreateTaskButton, 
  AddTaskIcon
} from "./material-components"

export const FeedHeader = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <Container>
      <CreateTaskButton 
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
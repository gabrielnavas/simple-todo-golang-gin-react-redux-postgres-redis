import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { QuestionToRemoveTask } from './question-to-remove-task';
import { TaskUpdate } from './task-update-data';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
};

type Props = {
  closeModal: () => void
  isOpen: boolean
  taskToUpdate: TaskUpdate
}

export const RemoveTaskModal = (props: Props) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.isOpen}
        onClose={() => props.closeModal()}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.isOpen}>
          <Box sx={style}>
            <QuestionToRemoveTask closeModal={props.closeModal} taskToUpdate={props.taskToUpdate} />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
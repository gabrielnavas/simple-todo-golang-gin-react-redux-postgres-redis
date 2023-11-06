import { styled } from "@mui/material"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"


export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  width: "400px",
});

export const CreateTaskButton = styled(Button)({
  minWidth: '7rem',
})

export const AddTaskIcon = styled(AddIcon)({})
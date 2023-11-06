import { useState } from 'react'

import moment from 'moment'

import { 
  ThreeDotsMenuIcon,
  ShowDate,
  Task,
  TaskContent,
  TaskHeader,
  TaskHeaderLeft,
  TaskHeaderRight
} from './material-components'

import { Button, Menu, MenuItem } from '@mui/material'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Task>
      <TaskHeader>
        <TaskHeaderLeft>
          <ShowDate> Criado em {moment(taskData.createdAt).format('DD/MM/YYYY, h:mm:ss a') }</ShowDate>
          <ShowDate> Atualizado em {moment(taskData.updatedAt).format('DD/MM/YYYY, h:mm:ss a') }</ShowDate>
        </TaskHeaderLeft>
        <TaskHeaderRight>

          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <ThreeDotsMenuIcon />
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleClose}><Button size="small" color="warning">Atualizar</Button></MenuItem>
            <MenuItem onClick={handleClose}><Button size="small" color="error">Remover</Button></MenuItem>
          </Menu>

        </TaskHeaderRight>
      </TaskHeader>
      <TaskContent>
        {taskData.description} 
      </TaskContent>
    </Task>
  )
}
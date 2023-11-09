import { useState } from "react";

import { 
  ThreeDotsMenuIcon,
} from './material-components'

import { Button, Menu, MenuItem } from '@mui/material'

import SyncAltIcon from '@mui/icons-material/SyncAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

type Props = {
  onClickUpdateButton: () => void
}

export const TaskItemMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        style={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',
        }}
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
        <MenuItem onClick={handleClose}>
          <Button size="small" color="warning" onClick={props.onClickUpdateButton}>
          <SyncAltIcon style={{ marginRight: '.5rem' }} />
          Atualizar
          </Button>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Button size="small" color="error">
            <DeleteForeverIcon style={{ marginRight: '.5rem' }} />
            Remover
          </Button>
        </MenuItem>
      </Menu>
    </>
  )
}
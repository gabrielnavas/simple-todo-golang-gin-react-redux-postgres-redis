import { Card, styled } from "@mui/material"

import MoreVertIcon from '@mui/icons-material/MoreVert';

export const ThreeDotsMenuIcon = MoreVertIcon

export const Task = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: "100px",
  width: "400px",
  background: 'lightgray',
  padding: '.5rem',
  marginBottom: '1rem'
});

export const TaskHeader = styled('div')({
  display: 'flex',
  width: "100%",
})

export const TaskHeaderLeft = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingLeft: '.5rem',
  width: '90%',
})

export const TaskHeaderRight = styled('div')({
  display: 'flex',
  width: '10%',
})

export const TaskContent = styled('div')({
  padding: '.5rem',
})

export const ShowDate = styled('div')({
  fontWeight: 200,
  color: '#555',
  fontSize: '.76rem',
  margin: '.15rem 0 .15rem 0'
})
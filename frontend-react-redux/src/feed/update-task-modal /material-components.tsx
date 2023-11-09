import { styled }from "@mui/system"
import { Button, TextField } from "@mui/material"

import UpdateIcon from '@mui/icons-material/Update'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const Container = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});


export const Input = styled(TextField)({
  marginBottom: '1rem',
  width: '100%'
});

export const ButtonAction = styled(Button)({
  marginBottom: '.6rem',
  width: '100%'
});

export const Inputs =  styled('div')({
  width: '100%'
});

export const Buttons = styled('div')({
  margin: '1rem 0 1rem 0',
  width: '100%'
});

export const UpdateTaskIcon = styled(UpdateIcon)({})

export const Title = styled('span')({
  fontWeight: '500',
  fontSize: '1.5rem',
  paddingBottom: '1rem',
})

export const Subtitle = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  padding: '.5rem'
})

export const SubtitleItem = styled('span')({
  fontWeight: 200,
  color: '#555',
  fontSize: '.76rem',
  margin: '.15rem 0 .15rem 0'
})
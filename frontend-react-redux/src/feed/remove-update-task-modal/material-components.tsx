import { styled }from "@mui/system"
import { Button } from "@mui/material"

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});


export const ButtonAction = styled(Button)({
  marginBottom: '.6rem',
  width: '100%',
});

export const Buttons = styled('div')({
  margin: '1rem 0 1rem 0',
  width: '100%'
});

export const RemoveTaskIcon = styled(DeleteForeverIcon)({
  marginRight: '.3rem'
})

export const CancelRemoveTaskIcon = styled(CancelIcon)({
  marginRight: '.3rem'
})

export const Title = styled('span')({
  fontWeight: '500',
  fontSize: '1.5rem',
  paddingBottom: '1rem',
})

export const Subtitle = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '.5rem'
})

export const SubtitleItem = styled('span')({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 200,
  color: '#555',
  fontSize: '.76rem',
  margin: '.15rem 0 .15rem 0'
})


export const QuestionToRemoveTaskText = styled('div')({
  fontWeight: '600',
  color: 'red',
  fontSize: '1rem',
  margin: '.15rem 0 .15rem 0'
})
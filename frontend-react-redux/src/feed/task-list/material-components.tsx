import { Alert, Stack, styled } from "@mui/material";

export const Container = styled('ul')({
  padding: 0
})

export const MessageList = styled(Stack)({
  width: '400px',
  padding: '1rem',
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

export const AlertMessage = styled(Alert)({
  width: '400px',
})

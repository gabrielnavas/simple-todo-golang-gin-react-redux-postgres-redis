import { styled }from "@mui/system"
import { Button, Card, CardContent, CardHeader, Checkbox, TextField } from "@mui/material"
import { Link } from "react-router-dom";

export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  minHeight: "100vh",
  width: "100vw",
  background: 'lightgray',
});

export const Content = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1.5rem',
  marginTop: '5rem', 
  marginBottom: '5rem', 
  width: '28rem',
  height: '30rem'
});

export const ContentHeader = styled(CardHeader)({
  fontWeight: "bold",
  fontSize: "2rem"
});

export const ContentContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
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
});

export const Buttons = styled('div')({
  margin: '1rem 0 1rem 0',
});

export const ActionsAfterButtons =  styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '1rem 0 1rem 0',
  paddingRight: '1rem',
  paddingLeft: '1rem'
});

export const RememberMe =  styled(Checkbox)({
});

export const ForgotPassword =  styled(Link)({
  textDecoration: 'none'
});


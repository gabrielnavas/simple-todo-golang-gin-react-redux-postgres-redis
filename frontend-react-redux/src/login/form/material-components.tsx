import { styled }from "@mui/system"
import { Button, Checkbox, TextField } from "@mui/material"
import { Link } from "react-router-dom";

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


import { styled }from "@mui/system"
import { Card, CardContent, CardHeader } from "@mui/material"

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

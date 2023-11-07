import { 
  MessageList, 
  AlertMessage, 
} from "./material-components"

type Props = {
  message: string
  type: 'error' | 'warning' | 'info' | 'success'
}

export const MessageAlert = (props: Props) => {
  return (
    <MessageList sx={{ width: '100%' }} spacing={2}>
      <AlertMessage severity={props.type}>{ props.message }</AlertMessage>
    </MessageList>
  )
}
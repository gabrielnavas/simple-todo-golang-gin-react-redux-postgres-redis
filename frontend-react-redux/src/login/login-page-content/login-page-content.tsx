import { Form } from '../form/form'
import {
  Content,
  ContentContent,
  ContentHeader,
} from './material-components'

export const LoginPageContent = () => {

  return (
    <Content raised>
      <ContentHeader 
        title="Autenticação"
        subheader="Entre com seus dados"
      />
      <ContentContent>
        <Form />
      </ContentContent>
    </Content>
  )
}
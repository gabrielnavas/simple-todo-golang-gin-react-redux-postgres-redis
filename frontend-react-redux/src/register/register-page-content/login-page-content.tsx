import { Form } from '../form/form'
import {
  Content,
  ContentContent,
  ContentHeader,
} from './material-components'

export const RegisterPageContent = () => {

  return (
    <Content raised>
      <ContentHeader 
        title="Registrar"
        subheader="Entre com seus dados"
      />
      <ContentContent>
        <Form />
      </ContentContent>
    </Content>
  )
}
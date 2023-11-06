import { FeedHeader } from '../feed-header/feed-header'
import { TaskList } from '../task-list/task-list'

import { Container } from './material-components'


export const FeedPage = () => {
  return (
    <Container>
      <FeedHeader />
      <TaskList />
    </Container>
  )
}
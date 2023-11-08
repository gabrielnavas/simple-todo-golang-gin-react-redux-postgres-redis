import { useEffect } from 'react';
import { FeedHeader } from '../feed-header/feed-header'
import { TaskList } from '../task-list/task-list'

import { Container } from './material-components'


export const FeedPage = () => {
  useEffect(() => {
    document.title = 'Tasks'
  }, []);

  return (
    <Container>
      <FeedHeader />
      <TaskList />
    </Container>
  )
}
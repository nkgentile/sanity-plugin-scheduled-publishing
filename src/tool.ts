import {CalendarIcon} from '@sanity/icons'
import {route} from 'part:@sanity/base/router'
import Tool from './components/Tool'

export default {
  component: Tool,
  icon: CalendarIcon,
  name: 'schedules',
  router: route('/:state'),
  title: 'Schedules',
}
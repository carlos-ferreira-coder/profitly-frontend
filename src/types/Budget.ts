import { ProjectProps } from './Project'
import { TaskProps } from './Task'

export type BudgetProps = {
  uuid: string
  date: string
  task: TaskProps[]
  project: ProjectProps
}

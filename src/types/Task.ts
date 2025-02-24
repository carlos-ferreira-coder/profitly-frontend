import { ActivityProps } from './Activity'
import { ExpenseProps } from './Expense'

export type TaskProps = {
  uuid: string
  type: string
  description: string
  beginDate: string
  endDate: string
  hourlyRate: string
  cost?: string
  revenue: string
  statusUuid: string
  userUuid?: string
  projectUuid: string
  budgetUuid?: string
  expense: ExpenseProps[]
  activity: ActivityProps[]
}

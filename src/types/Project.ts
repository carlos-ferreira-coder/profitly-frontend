export type ProjectProps = {
  uuid: string
  name: string
  description: string
  active: boolean
  clientUuid: string
  client: {
    name: string
  }
  statusUuid: string
  status: {
    name: string
    description: string
  }
  budgetUuid: string
  beginDate: string
  endDate: string
  financial: boolean
  prevTotal: string
  prevCost: string
  prevRevenue: string
  total: string
  cost: string
  revenue: string
  currentExpense: string
  currentIncome: string
  currentRevenue: string
}

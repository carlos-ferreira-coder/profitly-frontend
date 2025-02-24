export type ExpenseProps = {
  uuid: string
  description?: string
  type: string
  cost: string
  date: string
  userUuid: string
  taskUuid: string
  supplierUuid?: string
}

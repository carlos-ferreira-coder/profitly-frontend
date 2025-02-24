export type TransactionProps = {
  uuid: string
  type: string
  amount: string
  date: string
  description: string
  clientUuid: string
  projectUuid?: string
  userUuid: string
  client: {
    type: string
    cpf?: string
    cnpj?: string
    name: string
    fantasy?: string
  }
  project?: {
    name: string
    description: string
  }
  user: {
    username: string
    email: string
  }
}

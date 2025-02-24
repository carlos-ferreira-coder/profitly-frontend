export type UserProps = {
  uuid: string
  photo: string
  cpf: string
  name: string
  username: string
  email: string
  passwordCurrent?: string
  passwordNew?: string
  passwordCheck?: string
  active: boolean
  phone?: string
  hourlyRate?: string
  authUuid: string
  type?: string
}

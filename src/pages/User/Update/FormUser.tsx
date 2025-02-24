import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  faAddressCard,
  faBriefcase,
  faDollarSign,
  faEnvelope,
  faPhone,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { Select, Options } from '../../../components/Form/Select'
import Alert from '../../../components/Alert/Index'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import Switcher from '../../../components/Form/Switcher'
import Button from '../../../components/Form/Button'
import { userSchema } from '../../../hooks/schema/useUserSchema'
import { UserProps } from '../../../types/User'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

const FormUser = ({ user, authOptions }: { user: UserProps; authOptions: Options[] }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // User schema
  const schema = z.object({
    uuid: userSchema.uuid,
    cpf: userSchema.cpf,
    active: userSchema.active,
    username: userSchema.username,
    name: userSchema.name,
    email: userSchema.email,
    phone: userSchema.phone,
    authUuid: userSchema.authUuid,
    hourlyRate: userSchema.hourlyRate,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: user.uuid,
    cpf: user.cpf,
    active: user.active,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    authUuid: user.authUuid,
    hourlyRate: user.hourlyRate,
  }

  // Hookform
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  // Handele reset
  const handleReset = () => {
    setAlertErrors(null)
    setAlertSuccesses(null)
    reset(defaultValues)
  }

  // Update user in backend
  const updateUser = async (data: SchemaProps) => {
    setStatus('request')

    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/user/update', data, {
        withCredentials: true,
      })

      if (response.status === 418) {
        navigate('/auth/login', { state: { logged: false, danger: [response.data.message] } })
      }

      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/user/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar usuários
        </Button>,
      ])
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 418) {
        navigate('/auth/login', { state: { logged: false, errors: [handleAxiosError(error)] } })
      }
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateUser)}>
      <Input type="text" hidden disabled {...register('uuid')} />

      <div className="mb-5.5 flex justify-between gap-5.5">
        <div className="w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="cpf">
            CPF <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <InputPattern
                  {...field}
                  id="cpf"
                  mask="_"
                  disabled
                  icon={faAddressCard}
                  iconPosition="left"
                  format="###.###.###-##"
                  placeholder="Digite o cpf"
                />
              )}
            />
          </div>
          {errors.cpf && <Alert type="danger" size="sm" data={[errors.cpf.message || '']} />}
        </div>

        <div className="relative">
          <div className="mb-3 block">
            <label
              className="flex justify-center items-center text-sm font-medium text-black dark:text-white"
              htmlFor="active"
            >
              Ativo
            </label>
          </div>

          <div className="flex items-center h-13">
            <Controller
              name="active"
              control={control}
              render={({ field }) => <Switcher {...field} />}
            />
          </div>
        </div>
      </div>

      <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="username"
        >
          Usuário <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            icon={faUserTie}
            iconPosition="left"
            autoComplete="name"
            {...register('username')}
            placeholder="Digite o nome do usuário"
          />
        </div>
        {errors.username && (
          <Alert type="danger" size="sm" data={[errors.username.message || '']} />
        )}
      </div>

      <div className="mb-5.5">
        <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="name">
          Nome Completo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="name"
            type="text"
            icon={faUser}
            iconPosition="left"
            autoComplete="name"
            {...register('name')}
            placeholder="Digite o nome completo"
          />
        </div>
        {errors.name && <Alert type="danger" size="sm" data={[errors.name.message || '']} />}
      </div>

      <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="email"
        >
          Email <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="email"
            type="text"
            icon={faEnvelope}
            iconPosition="left"
            autoComplete="email"
            {...register('email')}
            placeholder="Digite o email"
          />
        </div>
        {errors.email && <Alert type="danger" size="sm" data={[errors.email.message || '']} />}
      </div>

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full sm:w-1/2">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="authId"
          >
            Cargo atual <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Controller
              name="authUuid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="authId"
                  icon={faBriefcase}
                  iconPosition="left"
                  isSelected={true}
                  options={authOptions || []}
                />
              )}
            />
          </div>
          {errors.authUuid && (
            <Alert type="danger" size="sm" data={[errors.authUuid.message || '']} />
          )}
        </div>

        <div className="w-full sm:w-1/2">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="hourlyRate"
          >
            Valor da Hora <span className="text-slate-400">?</span>
          </label>
          <div className="relative">
            <Controller
              name="hourlyRate"
              control={control}
              render={({ field }) => (
                <InputNumeric
                  {...field}
                  id="hourlyRate"
                  icon={faDollarSign}
                  iconPosition="left"
                  prefix={'R$ '}
                  fixedDecimalScale
                  decimalScale={2}
                  allowNegative={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  placeholder="Digite o valor da hora"
                />
              )}
            />
          </div>
          {errors.hourlyRate && (
            <Alert type="danger" size="sm" data={[errors.hourlyRate.message || '']} />
          )}
        </div>
      </div>

      <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="phone"
        >
          Contato <span className="text-slate-400">?</span>
        </label>
        <div className="relative">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputPattern
                {...field}
                id="phone"
                mask="_"
                icon={faPhone}
                iconPosition="left"
                format="(##) # ####-####"
                autoComplete="phone"
                placeholder="Digite o telefone"
              />
            )}
          />
        </div>
        {errors.phone && <Alert type="danger" size="sm" data={[errors.phone.message || '']} />}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-end gap-5.5">
        <Button type="button" onClick={() => handleReset()} color="white">
          Resetar
        </Button>
        <Button color="primary" disabled={status === 'request'} loading={status === 'request'}>
          Editar
        </Button>
      </div>
    </form>
  )
}

export default FormUser

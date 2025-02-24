import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema } from '../../../hooks/schema/useClientSchema'
import { Controller, useForm } from 'react-hook-form'
import { Input, InputPattern } from '../../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { faEnvelope, faPhone, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ClientProps } from '../../../types/Client'
import Switcher from '../../../components/Form/Switcher'

const Form = ({ client }: { client: ClientProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Client schema
  const schema = z.object({
    uuid: clientSchema.uuid,
    name: clientSchema.name,
    fantasy: clientSchema.fantasy,
    email: clientSchema.email,
    phone: clientSchema.phone,
    active: clientSchema.active,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: client.uuid,
    name: client.name,
    fantasy: client.fantasy,
    email: client.email,
    phone: client.phone,
    active: client.active,
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

  // Handle reset
  const handleReset = () => {
    setAlertErrors(null)
    setAlertSuccesses(null)
    reset(defaultValues)
  }

  // Update client in backend
  const updateClient = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/client/update', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/client/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Clientes
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateClient)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />

      <div className="flex justify-between gap-5 mb-6">
        <div className="w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="name">
            Nome <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              icon={faUserTie}
              iconPosition="left"
              autoComplete="name"
              {...register('name')}
              placeholder="Digite o nome"
            />
          </div>
          {errors.name && <Alert type="danger" size="sm" data={[errors.name.message || '']} />}
        </div>

        <div className="relative">
          <div className="flex justify-center">
            <label
              className="mb-2.5 block font-medium text-black dark:text-white text-center"
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

      {client.type === 'Person' ? null : (
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="fantasy">
            Nome fantasia <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              id="fantasy"
              type="text"
              icon={faUser}
              iconPosition="left"
              {...register('fantasy')}
              placeholder="Digite o nome do fantasia"
            />
          </div>
          {errors.fantasy && (
            <Alert type="danger" size="sm" data={[errors.fantasy.message || '']} />
          )}
        </div>
      )}

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="email">
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

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="phone">
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

      <div className="flex justify-between gap-5">
        <Button type="button" color="white" onClick={() => handleReset()}>
          Resetar
        </Button>
        <Button color="primary" disabled={status === 'request'} loading={status === 'request'}>
          Editar
        </Button>
      </div>
    </form>
  )
}

export default Form

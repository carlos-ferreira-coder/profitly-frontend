import { AuthProps } from '../../../types/Auth'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { Input } from '../../../components/Form/Input'
import Button from '../../../components/Form/Button'
import { authSchema } from '../../../hooks/schema/useAuthSchema'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Alert from '../../../components/Alert/Index'
import { Checkbox } from '../../../components/Form/Checkbox'

const Form = ({ auth }: { auth: AuthProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'complete'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Auth schema
  const schema = z.object({
    uuid: authSchema.uuid,
    type: authSchema.type,
    admin: authSchema.admin,
    project: authSchema.project,
    personal: authSchema.personal,
    financial: authSchema.financial,
  })
  type SchemaProps = z.infer<typeof schema>

  // Hookform
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      uuid: auth.uuid,
      type: auth.type,
      admin: auth.admin,
      project: auth.project,
      personal: auth.personal,
      financial: auth.financial,
    },
  })

  // Delete auth in backend
  const deleteAuth = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.delete(`/auth/delete/${data.uuid}`, {
        withCredentials: true,
      })

      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/auth/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar cargos / funções
        </Button>,
      ])

      setStatus('complete')
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(deleteAuth)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Cargo / Função
        </label>
        <div className="relative">
          <Input
            disabled
            id="type"
            type="text"
            icon={faBriefcase}
            iconPosition="left"
            {...register('type')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Autorizações
        </label>
        <div className="relative">
          <Controller
            name="admin"
            control={control}
            render={({ field }) => <Checkbox disabled label="Administração" {...field} />}
          />
          <Controller
            name="project"
            control={control}
            render={({ field }) => <Checkbox disabled label="Editar Projetos" {...field} />}
          />
          <Controller
            name="personal"
            control={control}
            render={({ field }) => <Checkbox disabled label="Informações pessoais" {...field} />}
          />
          <Controller
            name="financial"
            control={control}
            render={({ field }) => <Checkbox disabled label="Informações financeiras" {...field} />}
          />
        </div>
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-between gap-5">
        <Button
          color="danger"
          disabled={status === 'request' || status === 'complete'}
          loading={status === 'request'}
        >
          Deletar
        </Button>
      </div>
    </form>
  )
}

export default Form

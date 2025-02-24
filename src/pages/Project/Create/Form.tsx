import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/Form/Input'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { faAlignLeft, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { projectSchema } from '../../../hooks/schema/useProjectSchema'
import SearchClient from '../../../hooks/search/useSearchClient'
import { ClientProps } from '../../../types/Client'
import { StatusProps } from '../../../types/Status'
import Switcher from '../../../components/Form/Switcher'
import SearchStatus from '../../../hooks/search/useSearchStatus'

const Form = () => {
  const navigate = useNavigate()
  const [request, setRequest] = useState<'idle' | 'request'>('idle')
  const [client, setClient] = useState<ClientProps | null>(null)
  const [status, setStatus] = useState<StatusProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Project schema
  const schema = z.object({
    name: projectSchema.name,
    description: projectSchema.description,
    active: projectSchema.active,
    clientUuid: projectSchema.clientUuid,
    statusUuid: projectSchema.statusUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    name: '',
    description: '',
    active: true,
    clientUuid: '',
    statusUuid: '',
  }

  // Hookform
  const {
    reset,
    control,
    register,
    setValue,
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

    setClient(null)
    setStatus(null)

    reset(defaultValues)
  }

  useEffect(() => {
    setValue('clientUuid', client ? client.uuid : '')
  }, [client, setValue])

  useEffect(() => {
    setValue('statusUuid', status ? status.uuid : '')
  }, [status, setValue])

  // Create project in backend
  const createProject = async (data: SchemaProps) => {
    setRequest('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.post('/project/create', data, {
        withCredentials: true,
      })

      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate(`/project/budget/${response.data.project.uuid}`)}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Fazer orçamento
        </Button>,
        <br />,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/project/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Projetos
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  return (
    <form onSubmit={handleSubmit(createProject)}>
      <div className="flex justify-between gap-5 mb-6">
        <div className="w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="name">
            Nome <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              icon={faProjectDiagram}
              iconPosition="left"
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

      <div className="mb-6">
        <label
          className="mb-2.5 block font-medium text-black dark:text-white"
          htmlFor="description"
        >
          Descrição <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="description"
            type="text"
            icon={faAlignLeft}
            iconPosition="left"
            {...register('description')}
            placeholder="Digite a descrição"
          />
        </div>
        {errors.description && (
          <Alert type="danger" size="sm" data={[errors.description.message || '']} />
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="clientUuid">
          Cliente <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input type="text" id="clientUuid" disabled hidden {...register('clientUuid')} />

          <SearchClient client={client} setClient={setClient} />
        </div>
        {errors.clientUuid && (
          <Alert type="danger" size="sm" data={[errors.clientUuid.message || '']} />
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="statusUuid">
          Status <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input type="text" id="statusUuid" disabled hidden {...register('statusUuid')} />

          <SearchStatus status={status} setStatus={setStatus} />
        </div>
        {errors.statusUuid && (
          <Alert type="danger" size="sm" data={[errors.statusUuid.message || '']} />
        )}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-between gap-5">
        <Button color="white" type="button" onClick={() => handleReset()}>
          Limpar
        </Button>
        <Button color="primary" disabled={request === 'request'} loading={request === 'request'}>
          Cadastrar
        </Button>
      </div>
    </form>
  )
}

export default Form

import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { faAlignLeft, faCalendar, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { UserProps } from '../../../types/User'
import SearchUser from '../../../hooks/search/useSearchUser'
import { activitySchema } from '../../../hooks/schema/useActivitySchema'
import { TaskProps } from '../../../types/Task'
import SearchTask from '../../../hooks/search/useSearchTask'

const Form = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [user, setUser] = useState<UserProps | null>(null)
  const [task, setTask] = useState<TaskProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Transaction schema
  const schema = z.object({
    description: activitySchema.description,
    beginDate: activitySchema.beginDate,
    endDate: activitySchema.endDate,
    hourlyRate: activitySchema.hourlyRate,
    userUuid: activitySchema.userUuid,
    taskUuid: activitySchema.taskUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    description: '',
    beginDate: '',
    endDate: '',
    hourlyRate: '',
    userUuid: '',
    taskUuid: '',
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

    setUser(null)
    setTask(null)

    reset(defaultValues)
  }

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  useEffect(() => {
    setValue('taskUuid', task ? task.uuid : '')
  }, [task, setValue])

  // Create activity in backend
  const createActivity = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.post('/activity/create', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/activity/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar atividades
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(createActivity)}>
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
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="beginDate">
          Data inicial <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="beginDate"
            control={control}
            render={({ field }) => (
              <InputPattern
                {...field}
                id="beginDate"
                mask="_"
                icon={faCalendar}
                iconPosition="left"
                format="##/##/## ##:##"
                placeholder="dd/mm/aa --:--"
              />
            )}
          />
        </div>
        {errors.beginDate && (
          <Alert type="danger" size="sm" data={[errors.beginDate.message || '']} />
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="endDate">
          Data final <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <InputPattern
                {...field}
                id="endDate"
                mask="_"
                icon={faCalendar}
                iconPosition="left"
                format="##/##/## ##:##"
                placeholder="dd/mm/aa --:--"
              />
            )}
          />
        </div>
        {errors.endDate && <Alert type="danger" size="sm" data={[errors.endDate.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="hourlyRate">
          Custo <span className="text-danger">*</span>
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

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="userUuid">
          Usuário <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input type="text" id="userUuid" disabled hidden {...register('userUuid')} />

          <SearchUser user={user} setUser={setUser} />
        </div>
        {errors.userUuid && (
          <Alert type="danger" size="sm" data={[errors.userUuid.message || '']} />
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="taskUuid">
          Tarefa <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input type="text" id="taskUuid" disabled hidden {...register('taskUuid')} />

          <SearchTask task={task} setTask={setTask} />
        </div>
        {errors.taskUuid && (
          <Alert type="danger" size="sm" data={[errors.taskUuid.message || '']} />
        )}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-between gap-5">
        <Button color="white" type="button" onClick={() => handleReset()}>
          Limpar
        </Button>
        <Button color="primary" disabled={status === 'request'} loading={status === 'request'}>
          Cadastrar
        </Button>
      </div>
    </form>
  )
}

export default Form

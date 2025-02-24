import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { faAlignLeft, faCalendar, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ActivityProps } from '../../../types/Activity'
import { activitySchema } from '../../../hooks/schema/useActivitySchema'
import { UserProps } from '../../../types/User'
import { TaskProps } from '../../../types/Task'
import SearchUser from '../../../hooks/search/useSearchUser'
import SearchTask from '../../../hooks/search/useSearchTask'

const Form = ({ activity }: { activity: ActivityProps }) => {
  const navigate = useNavigate()
  const [request, setRequest] = useState<'idle' | 'request' | 'loanding'>('idle')
  const [user, setUser] = useState<UserProps | null>(null)
  const [task, setTask] = useState<TaskProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  const getDefaultData = async () => {
    setRequest('loanding')

    try {
      const [
        {
          data: { 0: resUser },
        },
        {
          data: { 0: resTask },
        },
      ] = await Promise.all([
        axios.get(`user/select/${activity.userUuid}`, { withCredentials: true }),
        axios.get(`task/select/${activity.taskUuid}`, { withCredentials: true }),
      ])

      setUser(resUser)
      setTask(resTask)
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  useEffect(() => {
    getDefaultData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Activity schema
  const schema = z.object({
    uuid: activitySchema.uuid,
    description: activitySchema.description,
    beginDate: activitySchema.beginDate,
    endDate: activitySchema.endDate,
    hourlyRate: activitySchema.hourlyRate,
    userUuid: activitySchema.userUuid,
    taskUuid: activitySchema.taskUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: activity.uuid,
    description: activity.description,
    beginDate: activity.beginDate,
    endDate: activity.endDate,
    hourlyRate: activity.hourlyRate,
    userUuid: activity.userUuid,
    taskUuid: activity.taskUuid,
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

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  useEffect(() => {
    setValue('taskUuid', task ? task.uuid : '')
  }, [task, setValue])

  // Handle reset
  const handleReset = async () => {
    setAlertErrors(null)
    setAlertSuccesses(null)

    reset(defaultValues)

    getDefaultData()
  }

  // Update activity in backend
  const updateActivity = async (data: SchemaProps) => {
    setRequest('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/activity/update', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/activity/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Atividade
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateActivity)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />
      {errors.uuid && <Alert type="danger" size="sm" data={[errors.uuid.message || '']} />}

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
          Valor da hora <span className="text-danger">*</span>
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
        <Button
          type="button"
          color="white"
          onClick={() => handleReset()}
          disabled={request === 'loanding'}
          loading={request === 'loanding'}
        >
          Resetar
        </Button>
        <Button
          color="primary"
          disabled={request !== 'idle'}
          loading={request === 'request' || request === 'loanding'}
        >
          Editar
        </Button>
      </div>
    </form>
  )
}

export default Form

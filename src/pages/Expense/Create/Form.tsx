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
import { SupplierProps } from '../../../types/Supplier'
import { expenseSchema } from '../../../hooks/schema/useExpenseSchema'
import SearchSupplier from '../../../hooks/search/useSearchSupplier'
import { TaskProps } from '../../../types/Task'
import SearchTask from '../../../hooks/search/useSearchTask'

const Form = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [user, setUser] = useState<UserProps | null>(null)
  const [task, setTask] = useState<TaskProps | null>(null)
  const [supplier, setSupplier] = useState<SupplierProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Transaction schema
  const schema = z.object({
    type: expenseSchema.type,
    description: expenseSchema.description,
    cost: expenseSchema.cost,
    date: expenseSchema.date,
    userUuid: expenseSchema.userUuid,
    taskUuid: expenseSchema.taskUuid,
    supplierUuid: expenseSchema.supplierUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    type: '',
    description: '',
    cost: '',
    date: '',
    userUuid: '',
    taskUuid: '',
    supplierUuid: '',
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
    setSupplier(null)

    reset(defaultValues)
  }

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  useEffect(() => {
    setValue('taskUuid', task ? task.uuid : '')
  }, [task, setValue])

  useEffect(() => {
    setValue('supplierUuid', supplier ? supplier.uuid : '')
  }, [supplier, setValue])

  // Create expense in backend
  const createExpense = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.post('/expense/create', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/expense/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar despesas
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(createExpense)}>
      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Tipo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="description"
            type="text"
            icon={faAlignLeft}
            iconPosition="left"
            {...register('type')}
            placeholder="Digite o tipo"
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
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
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="cost">
          Custo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="cost"
            control={control}
            render={({ field }) => (
              <InputNumeric
                {...field}
                id="cost"
                icon={faDollarSign}
                iconPosition="left"
                prefix={'R$ '}
                fixedDecimalScale
                decimalScale={2}
                allowNegative={false}
                decimalSeparator=","
                thousandSeparator="."
                placeholder="Digite o custo"
              />
            )}
          />
        </div>
        {errors.cost && <Alert type="danger" size="sm" data={[errors.cost.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="date">
          Data <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <InputPattern
                {...field}
                id="date"
                mask="_"
                icon={faCalendar}
                iconPosition="left"
                format="##/##/## ##:##"
                placeholder="dd/mm/aa --:--"
              />
            )}
          />
        </div>
        {errors.date && <Alert type="danger" size="sm" data={[errors.date.message || '']} />}
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

      <div className="mb-6">
        <label
          className="mb-2.5 block font-medium text-black dark:text-white"
          htmlFor="supplierUuid"
        >
          Fornecedor <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input type="text" id="supplierUuid" disabled hidden {...register('supplierUuid')} />

          <SearchSupplier supplier={supplier} setSupplier={setSupplier} />
        </div>
        {errors.supplierUuid && (
          <Alert type="danger" size="sm" data={[errors.supplierUuid.message || '']} />
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

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
import { ExpenseProps } from '../../../types/Expense'
import { expenseSchema } from '../../../hooks/schema/useExpenseSchema'
import { UserProps } from '../../../types/User'
import { TaskProps } from '../../../types/Task'
import { SupplierProps } from '../../../types/Supplier'
import SearchUser from '../../../hooks/search/useSearchUser'
import SearchTask from '../../../hooks/search/useSearchTask'
import SearchSupplier from '../../../hooks/search/useSearchSupplier'

const Form = ({ expense }: { expense: ExpenseProps }) => {
  const navigate = useNavigate()
  const [request, setRequest] = useState<'idle' | 'request' | 'loanding'>('idle')
  const [user, setUser] = useState<UserProps | null>(null)
  const [task, setTask] = useState<TaskProps | null>(null)
  const [supplier, setSupplier] = useState<SupplierProps | null>(null)
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
        {
          data: { 0: resSupplier },
        },
      ] = await Promise.all([
        axios.get(`user/select/${expense.userUuid}`, { withCredentials: true }),
        axios.get(`task/select/${expense.taskUuid}`, { withCredentials: true }),
        axios.get(`supplier/select/${expense.supplierUuid}`, { withCredentials: true }),
      ])

      setUser(resUser)
      setTask(resTask)
      setSupplier(resSupplier)
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  useEffect(() => {
    getDefaultData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Expense schema
  const schema = z.object({
    uuid: expenseSchema.uuid,
    description: expenseSchema.description,
    type: expenseSchema.type,
    cost: expenseSchema.cost,
    date: expenseSchema.date,
    userUuid: expenseSchema.userUuid,
    taskUuid: expenseSchema.taskUuid,
    supplierUuid: expenseSchema.supplierUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: expense.uuid,
    description: expense.description,
    type: expense.type,
    cost: expense.cost,
    date: expense.date,
    userUuid: expense.userUuid,
    taskUuid: expense.taskUuid,
    supplierUuid: expense.supplierUuid,
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

  useEffect(() => {
    setValue('supplierUuid', supplier ? supplier.uuid : '')
  }, [supplier, setValue])

  // Handle reset
  const handleReset = async () => {
    setAlertErrors(null)
    setAlertSuccesses(null)

    reset(defaultValues)

    getDefaultData()
  }

  // Update expense in backend
  const updateExpense = async (data: SchemaProps) => {
    setRequest('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/expense/update', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/expense/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Despesas
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateExpense)}>
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
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Tipo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="type"
            type="text"
            icon={faAlignLeft}
            iconPosition="left"
            {...register('type')}
            placeholder="Digite a descrição"
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="cost">
          custo <span className="text-danger">*</span>
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

import Button from '../../../components/Form/Button'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '../../../components/Alert/Index'
import { useEffect, useState } from 'react'
import { UserProps } from '../../../types/User'
import SearchUser from '../../../hooks/search/useSearchUser'
import { TaskProps } from '../../../types/Task'
import { SupplierProps } from '../../../types/Supplier'
import SearchTask from '../../../hooks/search/useSearchTask'
import SearchSupplier from '../../../hooks/search/useSearchSupplier'

const Filter = ({
  filtering,
  setFiltering,
}: {
  filtering: 'idle' | 'filter' | 'reset'
  setFiltering: (value: 'idle' | 'filter' | 'reset') => void
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProps | null>(null)
  const [task, setTask] = useState<TaskProps | null>(null)
  const [supplier, setSupplier] = useState<SupplierProps | null>(null)

  const date = z
    .string({
      message: 'A data deve ser um texto',
    })
    .regex(/^$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{2}) ([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'Digite uma data válida',
    })
    .optional()
    .transform((s) => {
      if (!s) return undefined

      const [date, time] = s.split(' ')
      const [hour, minute] = time.split(':')
      const [day, month, year] = date.split('/')

      return `20${year}-${month}-${day}T${hour}:${minute}:00`
    })

  const schema = z.object({
    description: z.string(),
    type: z.string(),
    costMin: z.string(),
    costMax: z.string(),
    dateMin: date,
    dateMax: date,
    userUuid: z.string(),
    taskUuid: z.string(),
    supplierUuid: z.string(),
  })

  type FilterProps = z.infer<typeof schema>

  const defaultValues = {
    description: '',
    type: '',
    costMin: '',
    costMax: '',
    dateMin: '',
    dateMax: '',
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
  } = useForm<FilterProps>({
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
  const handleReset = () => {
    if (location.search) {
      setUser(null)
      setTask(null)
      setSupplier(null)

      reset(defaultValues)

      navigate('/expense/select')
    }
  }

  // Pass filter on url
  const filter = (data: FilterProps) => {
    setFiltering('filter')
    let urlQuery = ''

    // Function to add query in url
    const appendQuery = (key: string, value: string) => {
      const encodeKey = encodeURIComponent(key)
      const encodeValue = encodeURIComponent(value)

      if (urlQuery === '') {
        return `?${encodeKey}=${encodeValue}`
      }
      return `${urlQuery}&${encodeKey}=${encodeValue}`
    }

    // Get all filters
    ;(Object.keys(data) as Array<keyof FilterProps>).forEach((key) => {
      const value = data[key]

      if (typeof value === 'string') {
        if (value !== '') urlQuery = appendQuery(key, value)
      }
    })

    if (location.search === urlQuery) {
      setFiltering('idle')
    } else {
      navigate(`/expense/select${urlQuery}`)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(filter)}>
        <div className="mb-5.5">
          <label
            htmlFor="type"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Tipo
          </label>
          <div className="relative">
            <Input id="name" type="text" {...register('type')} placeholder="Digite o tipo" />
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="description"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Descrição
          </label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              {...register('description')}
              placeholder="Digite a descrição"
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="costMin"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Custo Minimo
          </label>
          <div className="relative">
            <Controller
              name="costMin"
              control={control}
              render={({ field }) => (
                <InputNumeric
                  {...field}
                  id="costMin"
                  prefix={'R$ '}
                  fixedDecimalScale
                  decimalScale={2}
                  allowNegative={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  placeholder="Digite o custo minimo."
                />
              )}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="costMax"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Custo Máximo
          </label>
          <div className="relative">
            <Controller
              name="costMax"
              control={control}
              render={({ field }) => (
                <InputNumeric
                  {...field}
                  id="costMax"
                  prefix={'R$ '}
                  fixedDecimalScale
                  decimalScale={2}
                  allowNegative={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  placeholder="Digite o custo máximo."
                />
              )}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="dateMin"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Data Minima
          </label>
          <div className="relative">
            <Controller
              name="dateMin"
              control={control}
              render={({ field }) => (
                <InputPattern
                  {...field}
                  id="dateMin"
                  mask="_"
                  icon={faCalendar}
                  iconPosition="right"
                  format="##/##/## ##:##"
                  placeholder="dd/mm/aa --:--"
                />
              )}
            />
          </div>
          {errors.dateMin && (
            <Alert type="danger" size="sm" data={[errors.dateMin.message || '']} />
          )}
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="dateMax"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Data Máxima
          </label>
          <div className="relative">
            <Controller
              name="dateMax"
              control={control}
              render={({ field }) => (
                <InputPattern
                  {...field}
                  id="dateMax"
                  mask="_"
                  icon={faCalendar}
                  iconPosition="right"
                  format="##/##/## ##:##"
                  placeholder="dd/mm/aa --:--"
                />
              )}
            />
          </div>
          {errors.dateMax && (
            <Alert type="danger" size="sm" data={[errors.dateMax.message || '']} />
          )}
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="userUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Usuário
          </label>
          <div className="relative">
            <Input type="text" id="userUuid" disabled hidden {...register('userUuid')} />

            <SearchUser user={user} setUser={setUser} />
          </div>
          {errors.userUuid && (
            <Alert type="danger" size="sm" data={[errors.userUuid.message || '']} />
          )}
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="taskUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Tarefa
          </label>
          <div className="relative">
            <Input type="text" id="taskUuid" disabled hidden {...register('taskUuid')} />

            <SearchTask task={task} setTask={setTask} />
          </div>
          {errors.taskUuid && (
            <Alert type="danger" size="sm" data={[errors.taskUuid.message || '']} />
          )}
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="supplierUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Fornecedor
          </label>
          <div className="relative">
            <Input type="text" id="fornecedorUuid" disabled hidden {...register('supplierUuid')} />

            <SearchSupplier supplier={supplier} setSupplier={setSupplier} />
          </div>
          {errors.supplierUuid && (
            <Alert type="danger" size="sm" data={[errors.supplierUuid.message || '']} />
          )}
        </div>

        <div className="flex gap-5.5">
          <Button
            color="white"
            type="button"
            onClick={() => handleReset()}
            disabled={filtering !== 'idle'}
            loading={filtering === 'reset'}
          >
            Limpar
          </Button>
          <Button color="primary" disabled={filtering !== 'idle'} loading={filtering === 'filter'}>
            Filtrar
          </Button>
        </div>
      </form>
    </>
  )
}

export default Filter

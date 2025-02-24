import Button from '../../../components/Form/Button'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { Checkbox } from '../../../components/Form/Checkbox'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '../../../components/Alert/Index'
import SearchClient from '../../../hooks/search/useSearchClient'
import { useEffect, useState } from 'react'
import { ClientProps } from '../../../types/Client'
import { UserProps } from '../../../types/User'
import { ProjectProps } from '../../../types/Project'
import SearchUser from '../../../hooks/search/useSearchUser'
import SearchProject from '../../../hooks/search/useSearchProject'

const Filter = ({
  filtering,
  setFiltering,
}: {
  filtering: 'idle' | 'filter' | 'reset'
  setFiltering: (value: 'idle' | 'filter' | 'reset') => void
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [client, setClient] = useState<ClientProps | null>(null)
  const [user, setUser] = useState<UserProps | null>(null)
  const [project, setProject] = useState<ProjectProps | null>(null)

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
    allType: z.boolean(),
    type: z.array(
      z.object({
        key: z.string(),
        name: z.string(),
        value: z.boolean(),
      })
    ),
    amountMin: z.string(),
    amountMax: z.string(),
    dateMin: date,
    dateMax: date,
    clientUuid: z.string(),
    projectUuid: z.string(),
    userUuid: z.string(),
  })

  type FilterProps = z.infer<typeof schema>

  const defaultValues = {
    allType: true,
    type: [
      { key: 'Expense', name: 'Expense', value: true },
      { key: 'Income', name: 'Income', value: true },
      { key: 'Transfer', name: 'Transfer', value: true },
      { key: 'Loan', name: 'Loan', value: true },
      { key: 'Adjustment', name: 'Adjustment', value: true },
      { key: 'Refund', name: 'Refund', value: true },
    ],
    amountMin: '',
    amountMax: '',
    dateMin: '',
    dateMax: '',
    clientUuid: '',
    projectUuid: '',
    userUuid: '',
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
    setValue('clientUuid', client ? client.uuid : '')
  }, [client, setValue])

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  useEffect(() => {
    setValue('projectUuid', project ? project.uuid : '')
  }, [project, setValue])

  // Handle reset
  const handleReset = () => {
    if (location.search) {
      setClient(null)
      setUser(null)
      setProject(null)

      reset(defaultValues)

      navigate('/transaction/select')
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

      if (value && typeof value === 'object') {
        let keys = ''
        value.map((item: { key: boolean | string; name: string; value: boolean }) => {
          if (item.value) {
            if (keys === '') keys = `${item.key}`
            else keys = `${keys},${item.key}`
          }
        })
        if (keys !== '') urlQuery = appendQuery(key, keys)
      }
    })

    if (location.search === urlQuery) {
      setFiltering('idle')
    } else {
      navigate(`/transaction/select${urlQuery}`)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(filter)}>
        <div className="mb-5.5">
          <label
            htmlFor="allType"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Tipo
          </label>
          <div className="relative">
            <div className="mb-1">
              <Controller
                name="allType"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Selecionar Todos"
                    name={field.name}
                    value={field.value}
                    onChange={(e) => {
                      const isChecked = e.target.checked

                      setValue('type.0.value', isChecked)
                      setValue('type.1.value', isChecked)
                      setValue('type.2.value', isChecked)
                      setValue('type.3.value', isChecked)
                      setValue('type.4.value', isChecked)
                      setValue('type.5.value', isChecked)
                      setValue('type.6.value', isChecked)

                      field.onChange(isChecked)
                    }}
                  />
                )}
              />
            </div>

            <div className="ml-2 pl-3 border-l-2">
              <Controller
                name="type.0.value"
                control={control}
                render={({ field }) => <Checkbox label="Despesa" {...field} />}
              />
              <Controller
                name="type.1.value"
                control={control}
                render={({ field }) => <Checkbox label="Receita" {...field} />}
              />
              <Controller
                name="type.2.value"
                control={control}
                render={({ field }) => <Checkbox label="Transferencia" {...field} />}
              />
              <Controller
                name="type.3.value"
                control={control}
                render={({ field }) => <Checkbox label="Empréstimo" {...field} />}
              />
              <Controller
                name="type.4.value"
                control={control}
                render={({ field }) => <Checkbox label="Ajuste" {...field} />}
              />
              <Controller
                name="type.5.value"
                control={control}
                render={({ field }) => <Checkbox label="Reembolso" {...field} />}
              />
            </div>
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="amountMin"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Quantia Minima
          </label>
          <div className="relative">
            <Controller
              name="amountMin"
              control={control}
              render={({ field }) => (
                <InputNumeric
                  {...field}
                  id="amountMin"
                  prefix={'R$ '}
                  fixedDecimalScale
                  decimalScale={2}
                  allowNegative={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  placeholder="Digite a quantia minima."
                />
              )}
            />
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="amountMax"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Quantia Máxima
          </label>
          <div className="relative">
            <Controller
              name="amountMax"
              control={control}
              render={({ field }) => (
                <InputNumeric
                  {...field}
                  id="amountMax"
                  prefix={'R$ '}
                  fixedDecimalScale
                  decimalScale={2}
                  allowNegative={false}
                  decimalSeparator=","
                  thousandSeparator="."
                  placeholder="Digite a quantia máxima."
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
            htmlFor="clientUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Cliente
          </label>
          <div className="relative">
            <Input type="text" id="clientUuid" disabled hidden {...register('clientUuid')} />

            <SearchClient client={client} setClient={setClient} />
          </div>
          {errors.clientUuid && (
            <Alert type="danger" size="sm" data={[errors.clientUuid.message || '']} />
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
            htmlFor="projectUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Projeto
          </label>
          <div className="relative">
            <Input type="text" id="projectUuid" disabled hidden {...register('projectUuid')} />

            <SearchProject project={project} setProject={setProject} />
          </div>
          {errors.projectUuid && (
            <Alert type="danger" size="sm" data={[errors.projectUuid.message || '']} />
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

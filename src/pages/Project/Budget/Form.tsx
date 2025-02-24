import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Control, Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import {
  faAlignLeft,
  faCalendar,
  faDollarSign,
  faThumbTack,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BudgetProps } from '../../../types/Budget'
import { budgetSchema } from '../../../hooks/schema/useBudgetSchema'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { taskSchema } from '../../../hooks/schema/useTaskSchema'
import { Select } from '../../../components/Form/Select'
import { StatusProps } from '../../../types/Status'
import SearchStatus from '../../../hooks/search/useSearchStatus'
import { UserProps } from '../../../types/User'
import SearchUser from '../../../hooks/search/useSearchUser'
import { currencyToNumber, numberToCurrency } from '../../../hooks/useCurrency'
import { differenceInHours, parse } from 'date-fns'
import Loader from '../../../components/Loader'

const Form = ({ budget }: { budget: BudgetProps }) => {
  const navigate = useNavigate()
  const [request, setRequest] = useState<'idle' | 'request' | 'loanding'>('idle')
  const [status, setStatus] = useState<(StatusProps | null)[] | null>(null)
  const [user, setUser] = useState<(UserProps | null)[] | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  useEffect(() => {
    const getDefaultValues = async () => {
      setRequest('request')

      try {
        const [responseUser, responseStatus] = await Promise.all([
          axios.get('user/select/all', { withCredentials: true }),
          axios.get('status/select/all', { withCredentials: true }),
        ])

        const resUser: UserProps[] = responseUser.data || []
        const resStatus: StatusProps[] = responseStatus.data || []

        const usr: (UserProps | null)[] = []
        const sts: (StatusProps | null)[] = []

        for (let i = 0; i < budget.task.length; i++) {
          usr.push(resUser.find((u) => u.uuid === budget.task[i].userUuid) || null)
          sts.push(resStatus.find((s) => s.uuid === budget.task[i].statusUuid) || null)
        }

        setUser(usr)
        setStatus(sts)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }

      setRequest('idle')
    }

    getDefaultValues()
  }, [budget.task])

  // Budget schema
  const schema = z.object({
    uuid: budgetSchema.uuid,
    date: budgetSchema.date,
    task: z
      .array(
        z
          .object({
            uuid: z.string(),
            type: taskSchema.type,
            description: taskSchema.description,
            beginDate: taskSchema.beginDate,
            endDate: taskSchema.endDate,
            hourlyRate: taskSchema.hourlyRate,
            cost: taskSchema.cost,
            revenue: taskSchema.revenue,
            statusUuid: taskSchema.statusUuid,
            userUuid: taskSchema.userUuid,
            projectUuid: taskSchema.projectUuid,
            budgetUuid: taskSchema.budgetUuid,
          })
          .superRefine(({ beginDate, endDate, type, hourlyRate, cost }, ctx) => {
            if (beginDate > endDate) {
              ctx.addIssue({
                code: 'custom',
                message: 'A data final não pode ser antes da data inicial!',
                path: ['endDate'],
              })
            }

            if (type === 'Activity' && hourlyRate === null) {
              ctx.addIssue({
                code: 'custom',
                message: 'O valor da hora é obrigatório!',
                path: ['hourlyRate'],
              })
            }

            if (type === 'Expense' && cost === null) {
              ctx.addIssue({
                code: 'custom',
                message: 'O custo é obrigatório!',
                path: ['cost'],
              })
            }
          })
      )
      .min(1, { message: 'Insira as tarefas para prosseguir!' }),
  })
  type SchemaProps = z.infer<typeof schema>

  // Default values
  const defaultValues = {
    uuid: budget.uuid,
    date: budget.date,
    task: budget.task,
  }

  // Hookform
  const {
    watch,
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

  // Hookform -> FieldArray
  const { fields, append, remove } = useFieldArray({
    name: 'task',
    control,
  })

  useEffect(() => {
    if (status) {
      status.forEach((s, index) => {
        setValue(`task.${index}.statusUuid`, s ? s.uuid : '')
      })
    }
  }, [status, setValue])

  useEffect(() => {
    if (user) {
      user.forEach((u, index) => {
        setValue(`task.${index}.userUuid`, u ? u.uuid : '')
      })
    }
  }, [user, setValue])

  // Handle reset
  const handleReset = async () => {
    setAlertErrors(null)
    setAlertSuccesses(null)

    // TODO fazer
    setStatus(null)
    setUser(null)

    reset(defaultValues)
  }

  const Total = ({ control }: { control: Control<SchemaProps> }) => {
    const taskValues = useWatch({
      name: 'task',
      control,
    })

    const revenue = taskValues.reduce((acc, current) => {
      if (current.type === 'Expense') return acc + currencyToNumber(current.revenue || '0', 'BRL')

      const beginDate = parse(current.beginDate, 'dd/MM/yy HH:mm', new Date())
      const endDate = parse(current.endDate, 'dd/MM/yy HH:mm', new Date())
      const hours = differenceInHours(endDate, beginDate)

      return acc + hours * currencyToNumber(current.revenue || '0', 'BRL')
    }, 0)

    const cost = taskValues.reduce((acc, current) => {
      if (current.type === 'Expense') return acc + currencyToNumber(current.cost || '0', 'BRL')

      const beginDate = parse(current.beginDate, 'dd/MM/yy HH:mm', new Date())
      const endDate = parse(current.endDate, 'dd/MM/yy HH:mm', new Date())
      const hours = differenceInHours(endDate, beginDate)

      return acc + hours * currencyToNumber(current.hourlyRate || '0', 'BRL')
    }, 0)

    return (
      <>
        <p>
          <b>Valor Total: </b> {numberToCurrency(cost + revenue, 'BRL')}
        </p>
        <p>
          <b>Custo Total: </b> {numberToCurrency(cost, 'BRL')}
        </p>
        <p>
          <b>Lucro Total: </b> {numberToCurrency(revenue, 'BRL')}
        </p>
      </>
    )
  }

  const addTask = () => {
    setStatus((prevStatus) => (prevStatus ? [...prevStatus, null] : [null]))
    setUser((prevUser) => (prevUser ? [...prevUser, null] : [null]))

    append({
      uuid: '',
      type: 'Activity',
      description: '',
      beginDate: '',
      endDate: '',
      hourlyRate: '',
      cost: '',
      revenue: '',
      statusUuid: '',
      userUuid: '',
      projectUuid: budget.project.uuid,
      budgetUuid: budget.uuid,
    })
  }

  const rmvTask = (index: number) => {
    remove(index)

    setStatus((prevStatus) => prevStatus && prevStatus.filter((_, i) => i !== index))
    setUser((prevUser) => prevUser && prevUser.filter((_, i) => i !== index))
  }

  // Update budget in backend
  const updateBudget = async (data: SchemaProps) => {
    setRequest('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/project/budget/update', data, {
        withCredentials: true,
      })

      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/project/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Projetos
        </Button>,
      ])

      // TODO colocar os uuids na tarefas adicionadas
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setRequest('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateBudget)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />
      {errors.uuid && <Alert type="danger" size="sm" data={[errors.uuid.message || '']} />}

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
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="">
          Tarefas
        </label>
        <div className="p-5 shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          <div className="flex justify-between gap-5">
            <Button color="primary" type="button" onClick={() => addTask()}>
              Inserir tarefa
            </Button>
          </div>

          {user && status ? (
            fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="my-8 p-3 text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
                >
                  <Input
                    id={`task.${index}.uuid`}
                    type="text"
                    hidden
                    disabled
                    {...register(`task.${index}.uuid`)}
                  />
                  {errors.task?.[index]?.uuid && (
                    <Alert
                      type="danger"
                      size="sm"
                      data={[errors.task?.[index].uuid.message || '']}
                    />
                  )}

                  <Input
                    id={`task.${index}.projectUuid`}
                    type="text"
                    hidden
                    disabled
                    {...register(`task.${index}.projectUuid`)}
                  />

                  <Input
                    id={`task.${index}.budgetUuid`}
                    type="text"
                    hidden
                    disabled
                    {...register(`task.${index}.budgetUuid`)}
                  />

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.type`}
                    >
                      Tipo <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            id={`task.${index}.type`}
                            icon={faThumbTack}
                            iconPosition="left"
                            options={[
                              { value: 'Activity', label: 'Atividade', disabled: false },
                              { value: 'Expense', label: 'Despesa', disabled: false },
                            ]}
                          />
                        )}
                      />
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
                        id={`task.${index}.description`}
                        type="text"
                        icon={faAlignLeft}
                        iconPosition="left"
                        {...register(`task.${index}.description`)}
                        placeholder="Digite a descrição"
                      />
                    </div>
                    {errors.task?.[index]?.description && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].description.message || '']}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.beginDate`}
                    >
                      Data inicial <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.beginDate`}
                        control={control}
                        render={({ field }) => (
                          <InputPattern
                            {...field}
                            id={`task.${index}.beginDate`}
                            mask="_"
                            icon={faCalendar}
                            iconPosition="left"
                            format="##/##/## ##:##"
                            placeholder="dd/mm/aa --:--"
                          />
                        )}
                      />
                    </div>
                    {errors.task?.[index]?.beginDate && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].beginDate.message || '']}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.endDate`}
                    >
                      Data final <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.endDate`}
                        control={control}
                        render={({ field }) => (
                          <InputPattern
                            {...field}
                            id={`task.${index}.endDate`}
                            mask="_"
                            icon={faCalendar}
                            iconPosition="left"
                            format="##/##/## ##:##"
                            placeholder="dd/mm/aa --:--"
                          />
                        )}
                      />
                    </div>
                    {errors.task?.[index]?.endDate && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].endDate.message || '']}
                      />
                    )}
                  </div>

                  <div
                    className="mb-6"
                    style={{
                      display: watch(`task.${index}.type`) === 'Activity' ? 'block' : 'none',
                    }}
                  >
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.hourlyRate`}
                    >
                      Valor da Hora <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.hourlyRate`}
                        control={control}
                        render={({ field }) => (
                          <InputNumeric
                            {...field}
                            id={`task.${index}.hourlyRate`}
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
                    {errors.task?.[index]?.hourlyRate && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].hourlyRate.message || '']}
                      />
                    )}
                  </div>

                  <div
                    className="mb-6"
                    style={{
                      display: watch(`task.${index}.type`) === 'Expense' ? 'block' : 'none',
                    }}
                  >
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.cost`}
                    >
                      Custo <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.cost`}
                        control={control}
                        render={({ field }) => (
                          <InputNumeric
                            {...field}
                            id={`task.${index}.cost`}
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
                    {errors.task?.[index]?.cost && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].cost.message || '']}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.revenue`}
                    >
                      Lucro <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Controller
                        name={`task.${index}.revenue`}
                        control={control}
                        render={({ field }) => (
                          <InputNumeric
                            {...field}
                            id={`task.${index}.revenue`}
                            icon={faDollarSign}
                            iconPosition="left"
                            prefix={'R$ '}
                            fixedDecimalScale
                            decimalScale={2}
                            allowNegative={false}
                            decimalSeparator=","
                            thousandSeparator="."
                            placeholder="Digite o lucro"
                          />
                        )}
                      />
                    </div>
                    {errors.task?.[index]?.revenue && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].revenue.message || '']}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.statusUuid`}
                    >
                      Status <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        id={`task.${index}.statusUuid`}
                        disabled
                        hidden
                        {...register(`task.${index}.statusUuid`)}
                      />

                      <SearchStatus
                        status={status[index]}
                        setStatus={(newStatus) => {
                          setStatus(
                            (prevStatus) =>
                              prevStatus && prevStatus.map((s, i) => (i === index ? newStatus : s))
                          )
                        }}
                      />
                    </div>
                    {errors.task?.[index]?.statusUuid && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].statusUuid.message || '']}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-2.5 block font-medium text-black dark:text-white"
                      htmlFor={`task.${index}.userUuid`}
                    >
                      Usuário <span className="text-slate-400">?</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        id={`task.${index}.userUuid`}
                        disabled
                        hidden
                        {...register(`task.${index}.userUuid`)}
                      />

                      <SearchUser
                        user={user[index]}
                        setUser={(newUser) => {
                          setUser(
                            (prevUser) =>
                              prevUser && prevUser.map((u, i) => (i === index ? newUser : u))
                          )
                        }}
                      />
                    </div>
                    {errors.task?.[index]?.userUuid && (
                      <Alert
                        type="danger"
                        size="sm"
                        data={[errors.task?.[index].userUuid.message || '']}
                      />
                    )}
                  </div>

                  <Button color="danger" type="button" onClick={() => rmvTask(index)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </div>
              )
            })
          ) : (
            <Loader />
          )}

          {errors.task?.message && (
            <Alert type="danger" size="lg" data={[errors.task.message || '']} />
          )}
        </div>
      </div>

      <div className="mb-6">
        <Total control={control} />
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
          Salvar
        </Button>
      </div>
    </form>
  )
}

export default Form

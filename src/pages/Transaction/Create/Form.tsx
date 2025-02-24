import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { Select } from '../../../components/Form/Select'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import {
  faAlignLeft,
  faCalendar,
  faDollarSign,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { transactionSchema } from '../../../hooks/schema/useTransactionSchema'
import SearchClient from '../../../hooks/search/useSearchClient'
import { ClientProps } from '../../../types/Client'
import { ProjectProps } from '../../../types/Project'
import SearchProject from '../../../hooks/search/useSearchProject'
import { UserProps } from '../../../types/User'
import SearchUser from '../../../hooks/search/useSearchUser'

const Form = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [client, setClient] = useState<ClientProps | null>(null)
  const [project, setProject] = useState<ProjectProps | null>(null)
  const [user, setUser] = useState<UserProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Transaction schema
  const schema = z.object({
    type: transactionSchema.type,
    amount: transactionSchema.amount,
    date: transactionSchema.date,
    description: transactionSchema.description,
    clientUuid: transactionSchema.clientUuid,
    projectUuid: transactionSchema.projectUuid,
    userUuid: transactionSchema.userUuid,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    type: 'Income',
    amount: '',
    date: '',
    description: '',
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
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  // Handle reset
  const handleReset = () => {
    setAlertErrors(null)
    setAlertSuccesses(null)

    setClient(null)
    setProject(null)
    setUser(null)

    reset(defaultValues)
  }

  useEffect(() => {
    setValue('clientUuid', client ? client.uuid : '')
  }, [client, setValue])

  useEffect(() => {
    setValue('projectUuid', project ? project.uuid : '')
  }, [project, setValue])

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  // Create transaction in backend
  const createTransaction = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.post('/transaction/create', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/transaction/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar transações
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(createTransaction)}>
      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Tipo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="type"
                icon={faMoneyBillTransfer}
                iconPosition="left"
                options={[
                  { value: 'Expense', label: 'Despesa', disabled: false },
                  { value: 'Income', label: 'Receita', disabled: false },
                  { value: 'Transfer', label: 'Transferir', disabled: false },
                  { value: 'Loan', label: 'Empréstimo', disabled: false },
                  { value: 'Adjustment', label: 'Ajuste', disabled: false },
                  { value: 'Refund', label: 'Reembolso', disabled: false },
                ]}
              />
            )}
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="amount">
          Quantia <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <InputNumeric
                {...field}
                id="amount"
                icon={faDollarSign}
                iconPosition="left"
                prefix={'R$ '}
                fixedDecimalScale
                decimalScale={2}
                allowNegative={false}
                decimalSeparator=","
                thousandSeparator="."
                placeholder="Digite a quantia"
              />
            )}
          />
        </div>
        {errors.amount && <Alert type="danger" size="sm" data={[errors.amount.message || '']} />}
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
        <label
          className="mb-2.5 block font-medium text-black dark:text-white"
          htmlFor="projectUuid"
        >
          Projeto <span className="text-slate-400">?</span>
        </label>
        <div className="relative">
          <Input type="text" id="projectUuid" disabled hidden {...register('projectUuid')} />

          <SearchProject project={project} setProject={setProject} />
        </div>
        {errors.projectUuid && (
          <Alert type="danger" size="sm" data={[errors.projectUuid.message || '']} />
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

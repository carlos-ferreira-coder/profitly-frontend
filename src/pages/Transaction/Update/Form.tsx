import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../../../hooks/schema/useTransactionSchema'
import { Controller, useForm } from 'react-hook-form'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import {
  faAlignLeft,
  faCalendar,
  faDollarSign,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TransactionProps } from '../../../types/Transaction'
import { ClientProps } from '../../../types/Client'
import { ProjectProps } from '../../../types/Project'
import { UserProps } from '../../../types/User'
import { Select } from '../../../components/Form/Select'
import SearchClient from '../../../hooks/search/useSearchClient'
import SearchProject from '../../../hooks/search/useSearchProject'
import SearchUser from '../../../hooks/search/useSearchUser'
import Loader from '../../../components/Loader'

const Form = ({ transaction }: { transaction: TransactionProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'loanding'>('idle')
  const [client, setClient] = useState<ClientProps | null>(null)
  const [project, setProject] = useState<ProjectProps | null>(null)
  const [user, setUser] = useState<UserProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  const getDefaultData = async () => {
    setStatus('loanding')

    try {
      if (transaction.project) {
        const {
          data: { 0: resProject },
        } = await axios.get(`project/select/${transaction.projectUuid}`, {
          withCredentials: true,
        })

        setProject(resProject)
      }

      const [
        {
          data: { 0: resClient },
        },
        {
          data: { 0: resUser },
        },
      ] = await Promise.all([
        axios.get(`client/select/${transaction.clientUuid}`, { withCredentials: true }),
        axios.get(`user/select/${transaction.userUuid}`, { withCredentials: true }),
      ])

      setClient(resClient)
      setUser(resUser)
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  useEffect(() => {
    getDefaultData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Transaction schema
  const schema = z.object({
    uuid: transactionSchema.uuid,
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
    uuid: transaction.uuid,
    type: transaction.type,
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description,
    clientUuid: transaction.clientUuid,
    projectUuid: transaction.projectUuid,
    userUuid: transaction.userUuid,
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
    setValue('clientUuid', client ? client.uuid : '')
  }, [client, setValue])

  useEffect(() => {
    setValue('projectUuid', project ? project.uuid : '')
  }, [project, setValue])

  useEffect(() => {
    setValue('userUuid', user ? user.uuid : '')
  }, [user, setValue])

  // Handle reset
  const handleReset = async () => {
    setAlertErrors(null)
    setAlertSuccesses(null)

    reset(defaultValues)

    getDefaultData()
  }

  // Update transaction in backend
  const updateTransaction = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.put('/transaction/update', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/transaction/select')}
          className="h-8 w-50 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Transactiones
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(updateTransaction)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />
      {errors.uuid && <Alert type="danger" size="sm" data={[errors.uuid.message || '']} />}

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

          {status === 'loanding' ? (
            <Loader />
          ) : (
            <SearchClient client={client} setClient={setClient} />
          )}
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

          {status === 'loanding' ? (
            <Loader />
          ) : (
            <SearchProject project={project} setProject={setProject} />
          )}
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

          {status === 'loanding' ? <Loader /> : <SearchUser user={user} setUser={setUser} />}
        </div>
        {errors.userUuid && (
          <Alert type="danger" size="sm" data={[errors.userUuid.message || '']} />
        )}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-between gap-5">
        <Button
          type="button"
          color="white"
          onClick={() => handleReset()}
          disabled={status === 'loanding'}
          loading={status === 'loanding'}
        >
          Resetar
        </Button>
        <Button
          color="primary"
          disabled={status !== 'idle'}
          loading={status === 'request' || status === 'loanding'}
        >
          Editar
        </Button>
      </div>
    </form>
  )
}

export default Form

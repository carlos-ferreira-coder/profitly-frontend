import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, InputNumeric, InputPattern } from '../../../components/Form/Input'
import {
  faAlignLeft,
  faCalendar,
  faDollarSign,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../../../hooks/schema/useTransactionSchema'
import { TransactionProps } from '../../../types/Transaction'

const Form = ({ transaction }: { transaction: TransactionProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'complete'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Expense':
        return 'Despesa'
      case 'Income':
        return 'Receita'
      case 'Transfer':
        return 'Transferência'
      case 'Loan':
        return 'Empréstimo'
      case 'Adjustment':
        return 'Ajuste'
      case 'Refund':
        return 'Reembolso'
      default:
        return 'Outro'
    }
  }

  // Transaction schema
  const schema = z.object({
    uuid: transactionSchema.uuid,
    type: z.string(),
    amount: transactionSchema.amount,
    date: transactionSchema.date,
    description: transactionSchema.description,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: transaction.uuid,
    type: getTypeLabel(transaction.type),
    amount: transaction.amount,
    date: transaction.date,
    description: transaction.description,
  }

  // Hookform
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  // Delete transaction in backend
  const deleteTransaction = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.delete(`/transaction/delete/${data.uuid}`, {
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
          Listar Transações
        </Button>,
      ])

      setStatus('complete')
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(deleteTransaction)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Tipo
        </label>
        <div className="relative">
          <Input
            disabled
            id="type"
            type="text"
            icon={faMoneyBillTransfer}
            iconPosition="left"
            {...register('type')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="amount">
          Quantia
        </label>
        <div className="relative">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <InputNumeric
                {...field}
                disabled
                id="amount"
                icon={faDollarSign}
                iconPosition="left"
                prefix={'R$ '}
                fixedDecimalScale
                decimalScale={2}
                allowNegative={false}
                decimalSeparator=","
                thousandSeparator="."
                className="bg-slate-200 dark:bg-slate-700"
              />
            )}
          />
        </div>
        {errors.amount && <Alert type="danger" size="sm" data={[errors.amount.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="date">
          Data
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
                disabled
                icon={faCalendar}
                iconPosition="left"
                format="##/##/## ##:##"
                placeholder="dd/mm/aa --:--"
                className="bg-slate-200 dark:bg-slate-700"
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
          Descrição
        </label>
        <div className="relative">
          <Input
            disabled
            id="description"
            type="text"
            icon={faAlignLeft}
            iconPosition="left"
            {...register('description')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.description && (
          <Alert type="danger" size="sm" data={[errors.description.message || '']} />
        )}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-between gap-5">
        <Button
          color="danger"
          disabled={status === 'request' || status === 'complete'}
          loading={status === 'request'}
        >
          Deletar
        </Button>
      </div>
    </form>
  )
}

export default Form

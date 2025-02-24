import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../../components/Form/Input'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { expenseSchema } from '../../../hooks/schema/useExpenseSchema'
import { ExpenseProps } from '../../../types/Expense'

const Form = ({ expense }: { expense: ExpenseProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'complete'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Expense schema
  const schema = z.object({
    uuid: expenseSchema.uuid,
    type: expenseSchema.type,
    description: expenseSchema.description,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: expense.uuid,
    type: expense.type,
    description: expense.description,
  }

  // Hookform
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  // Delete expense in backend
  const deleteExpense = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.delete(`/expense/delete/${data.uuid}`, {
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
          Listar Despesas
        </Button>,
      ])

      setStatus('complete')
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(deleteExpense)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="type">
          Tipo <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="type"
            type="text"
            disabled
            icon={faAlignLeft}
            iconPosition="left"
            {...register('type')}
            className="bg-slate-200 dark:bg-slate-700"
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
            disabled
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

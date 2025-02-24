import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, InputPattern } from '../../../components/Form/Input'
import Switcher from '../../../components/Form/Switcher'
import {
  faAddressCard,
  faBriefcase,
  faEnvelope,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supplierSchema } from '../../../hooks/schema/useSupplierSchema'
import { SupplierProps } from '../../../types/Supplier'

const Form = ({ supplier }: { supplier: SupplierProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'complete'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Supplier schema
  const schema = z.object({
    uuid: supplierSchema.uuid,
    type: supplierSchema.type,
    cpf: supplierSchema.cpf,
    cnpj: supplierSchema.cnpj,
    name: supplierSchema.name,
    fantasy: supplierSchema.fantasy,
    email: supplierSchema.email,
    active: supplierSchema.active,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: supplier.uuid,
    type: supplier.type,
    cpf: supplier.cpf || null,
    cnpj: supplier.cnpj || null,
    name: supplier.name,
    fantasy: supplier.fantasy || null,
    email: supplier.email,
    active: supplier.active,
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

  // Delete supplier in backend
  const deleteSupplier = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.delete(`/supplier/delete/${data.uuid}`, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/supplier/select')}
          className="h-8 w-45 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar fornecedores
        </Button>,
      ])

      setStatus('complete')
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(deleteSupplier)}>
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
            icon={faBriefcase}
            iconPosition="left"
            {...register('type')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.type && <Alert type="danger" size="sm" data={[errors.type.message || '']} />}
      </div>

      <div className="flex justify-between gap-5 mb-6">
        {supplier.type === 'Person' ? (
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="cpf">
              CPF
            </label>
            <div className="relative">
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <InputPattern
                    {...field}
                    disabled
                    id="cpf"
                    mask="_"
                    icon={faAddressCard}
                    iconPosition="left"
                    format="###.###.###-##"
                    className="bg-slate-200 dark:bg-slate-700"
                  />
                )}
              />
            </div>
            {errors.cpf && <Alert type="danger" size="sm" data={[errors.cpf.message || '']} />}
          </div>
        ) : (
          <div className="w-full">
            <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="cnpj">
              CNPJ
            </label>
            <div className="relative">
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <InputPattern
                    {...field}
                    disabled
                    id="cnpj"
                    mask="_"
                    icon={faAddressCard}
                    iconPosition="left"
                    format="##.###.###/####-##"
                    className="bg-slate-200 dark:bg-slate-700"
                  />
                )}
              />
            </div>
            {errors.cnpj && <Alert type="danger" size="sm" data={[errors.cnpj.message || '']} />}
          </div>
        )}

        <div className="relative">
          <div className="flex justify-center">
            <label
              className="mb-2.5 block font-medium text-black dark:text-white text-center"
              htmlFor="active"
            >
              Ativo
            </label>
          </div>

          <div className="flex items-center h-13">
            <Controller
              name="active"
              control={control}
              render={({ field }) => <Switcher disabled {...field} />}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="name">
          Nome
        </label>
        <div className="relative">
          <Input
            disabled
            id="name"
            type="text"
            icon={faUserTie}
            iconPosition="left"
            {...register('name')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.name && <Alert type="danger" size="sm" data={[errors.name.message || '']} />}
      </div>

      {supplier.type === 'Person' ? null : (
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="fantasy">
            Nome fantasia
          </label>
          <div className="relative">
            <Input
              disabled
              id="fantasy"
              type="text"
              icon={faUser}
              iconPosition="left"
              {...register('fantasy')}
              className="bg-slate-200 dark:bg-slate-700"
            />
          </div>
          {errors.fantasy && (
            <Alert type="danger" size="sm" data={[errors.fantasy.message || '']} />
          )}
        </div>
      )}

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Input
            disabled
            id="email"
            type="text"
            icon={faEnvelope}
            iconPosition="left"
            {...register('email')}
            className="bg-slate-200 dark:bg-slate-700"
          />
        </div>
        {errors.email && <Alert type="danger" size="sm" data={[errors.email.message || '']} />}
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

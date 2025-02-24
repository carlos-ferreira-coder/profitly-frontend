import Button from '../../../components/Form/Button'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input } from '../../../components/Form/Input'
import Alert from '../../../components/Alert/Index'
import SearchClient from '../../../hooks/search/useSearchClient'
import { useEffect, useState } from 'react'
import { ClientProps } from '../../../types/Client'
import { StatusProps } from '../../../types/Status'
import SearchStatus from '../../../hooks/search/useSearchStatus'
import { Checkbox } from '../../../components/Form/Checkbox'

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
  const [status, setStatus] = useState<StatusProps | null>(null)

  // Filter props
  type FilterProps = {
    allStatus: boolean
    status: {
      key: boolean
      name: string
      value: boolean
    }[]
    name: string
    description: string
    clientUuid: string
    statusUuid: string
  }

  const defaultValues = {
    allStatus: true,
    status: [
      { key: true, name: 'active', value: true },
      { key: false, name: 'inactive', value: true },
    ],
    name: '',
    description: '',
    clientUuid: '',
    statusUuid: '',
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
    defaultValues: defaultValues,
  })

  useEffect(() => {
    setValue('clientUuid', client ? client.uuid : '')
  }, [client, setValue])

  useEffect(() => {
    setValue('statusUuid', status ? status.uuid : '')
  }, [status, setValue])

  // Handle reset
  const handleReset = () => {
    if (location.search) {
      setFiltering('reset')

      setClient(null)
      setStatus(null)

      reset(defaultValues)

      navigate('/project/select')
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
      navigate(`/project/select${urlQuery}`)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(filter)}>
        <div className="mb-5.5">
          <label
            htmlFor="allStatus"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Status
          </label>
          <div className="relative">
            <div className="mb-1">
              <Controller
                name="allStatus"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Selecionar Todos"
                    name={field.name}
                    value={field.value}
                    onChange={(e) => {
                      const isChecked = e.target.checked

                      setValue('status.0.value', isChecked)
                      setValue('status.1.value', isChecked)

                      field.onChange(isChecked)
                    }}
                  />
                )}
              />
            </div>

            <div className="ml-2 pl-3 border-l-2">
              <Controller
                name="status.0.value"
                control={control}
                render={({ field }) => <Checkbox label="Ativo" {...field} />}
              />
              <Controller
                name="status.1.value"
                control={control}
                render={({ field }) => <Checkbox label="Inativo" {...field} />}
              />
            </div>
          </div>
        </div>

        <div className="mb-5.5">
          <label
            htmlFor="name"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Nome
          </label>
          <div className="relative">
            <Input id="name" type="text" {...register('name')} placeholder="Digite o nome" />
          </div>
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
            htmlFor="statusUuid"
            className="mb-3 block text-sm font-medium text-black dark:text-white"
          >
            Status
          </label>
          <div className="relative">
            <Input type="text" id="statusUuid" disabled hidden {...register('statusUuid')} />

            <SearchStatus status={status} setStatus={setStatus} />
          </div>
          {errors.statusUuid && (
            <Alert type="danger" size="sm" data={[errors.statusUuid.message || '']} />
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

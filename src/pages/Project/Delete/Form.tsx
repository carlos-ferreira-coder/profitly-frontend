import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../../components/Form/Input'
import { faAlignLeft, faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '../../../hooks/schema/useProjectSchema'
import { ProjectProps } from '../../../types/Project'
import Switcher from '../../../components/Form/Switcher'

const Form = ({ project }: { project: ProjectProps }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request' | 'complete'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Project schema
  const schema = z.object({
    uuid: projectSchema.uuid,
    name: projectSchema.name,
    description: projectSchema.description,
    active: projectSchema.active,
  })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: project.uuid,
    name: project.name,
    description: project.description,
    active: project.active,
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

  // Delete project in backend
  const deleteProject = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.delete(`/project/delete/${data.uuid}`, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/project/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar Projetos
        </Button>,
      ])

      setStatus('complete')
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
      setStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(deleteProject)}>
      <Input id="uuid" type="text" hidden disabled {...register('uuid')} />

      <div className="flex justify-between gap-5 mb-6">
        <div className="w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="name">
            Nome <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              disabled
              icon={faProjectDiagram}
              iconPosition="left"
              {...register('name')}
              className="bg-slate-200 dark:bg-slate-700"
            />
          </div>
          {errors.name && <Alert type="danger" size="sm" data={[errors.name.message || '']} />}
        </div>

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

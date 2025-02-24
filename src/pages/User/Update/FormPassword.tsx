import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import Alert from '../../../components/Alert/Index'
import { Input } from '../../../components/Form/Input'
import { faLock, faLockOpen, faUnlock } from '@fortawesome/free-solid-svg-icons'
import Button from '../../../components/Form/Button'
import { userSchema } from '../../../hooks/schema/useUserSchema'
import { UserProps } from '../../../types/User'
import { useNavigate } from 'react-router-dom'

const FormPassword = ({ user, auth }: { user: UserProps; auth: boolean }) => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Password schema
  const schema = z
    .object({
      uuid: userSchema.uuid,
      passwordCurrent: auth
        ? userSchema.passwordCurrentOptional
        : userSchema.passwordCurrentNonEmpty,
      passwordNew: userSchema.passwordNew,
      passwordCheck: userSchema.passwordCheck,
    })
    .superRefine(({ passwordNew, passwordCheck }, ctx) => {
      if (passwordNew !== passwordCheck) {
        ctx.addIssue({
          code: 'custom',
          message: 'A confirmação de senha não corresponde a nova senha!',
          path: ['passwordCheck'],
        })
      }
    })
  type SchemaProps = z.infer<typeof schema>

  const defaultValues = {
    uuid: user.uuid,
    passwordCurrent: auth ? '******' : '',
    passwordNew: '',
    passwordCheck: '',
  }

  // Hookform
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  // Reset
  const handleReset = () => {
    setAlertErrors(null)
    setAlertSuccesses(null)
    reset(defaultValues)
  }

  // Update password on backend
  const updatePassword = async (data: SchemaProps) => {
    setStatus('request')

    setAlertErrors(null)
    setAlertSuccesses(null)

    try {
      const response = await axios.patch('/user/update/password', data, {
        withCredentials: true,
      })
      setAlertSuccesses([
        response.data.message,
        <Button
          type="button"
          color="success"
          onClick={() => navigate('/user/select')}
          className="h-8 w-35 bg-green-400 dark:text-form-input dark:bg-green-400"
        >
          Listar usuários
        </Button>,
      ])
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(updatePassword)}>
      <Input type="text" hidden disabled {...register('uuid')} />

      {!auth && (
        <div className="mb-5.5">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="passwordCurrent"
          >
            Senha atual <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Input
              id="passwordCurrent"
              type="password"
              icon={faLockOpen}
              iconPosition="left"
              autoComplete="current-password"
              {...register('passwordCurrent')}
              placeholder="Digite a senha antiga"
            />
          </div>
          {errors.passwordCurrent && (
            <Alert type="danger" size="sm" data={[errors.passwordCurrent.message || '']} />
          )}
        </div>
      )}

      <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="passwordNew"
        >
          Senha <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="passwordNew"
            type="password"
            icon={faLock}
            iconPosition="left"
            autoComplete="new-password"
            {...register('passwordNew')}
            placeholder="Digite a senha"
          />
        </div>
        {errors.passwordNew && (
          <Alert type="danger" size="sm" data={[errors.passwordNew.message || '']} />
        )}
      </div>

      <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="passwordCheck"
        >
          Confirmar Senha <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="passwordCheck"
            type="password"
            icon={faUnlock}
            iconPosition="left"
            autoComplete="new-password"
            {...register('passwordCheck')}
            placeholder="Confirme a senha"
          />
        </div>
        {errors.passwordCheck && (
          <Alert type="danger" size="sm" data={[errors.passwordCheck.message || '']} />
        )}
      </div>

      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="flex justify-end gap-4.5">
        <Button type="button" color="white" onClick={() => handleReset()}>
          Limpar
        </Button>
        <Button color="primary" disabled={status === 'request'} loading={status === 'request'}>
          Alterar
        </Button>
      </div>
    </form>
  )
}

export default FormPassword

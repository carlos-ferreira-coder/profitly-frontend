import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { Input } from '../../../components/Form/Input'
import Alert from '../../../components/Alert/Index'
import Button from '../../../components/Form/Button'
import { userSchema } from '../../../hooks/schema/useUserSchema'

const Form = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location

  const [status, setStatus] = useState<'idle' | 'request'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)
  const [alertWarnings, setAlertWarnings] = useState<(string | JSX.Element)[] | null>(null)
  const [alertSuccesses, setAlertSuccesses] = useState<(string | JSX.Element)[] | null>(null)

  // Set state alerts
  useEffect(() => {
    if (state?.errors) setAlertErrors(state?.errors)
    if (state?.warnings) setAlertWarnings(state?.warnings)
    if (state?.successes) setAlertSuccesses(state?.successes)
  }, [state])

  // Login schema
  const schema = z.object({
    email: userSchema.email,
    password: userSchema.passwordCurrentNonEmpty,
  })
  type SchemaProps = z.infer<typeof schema>

  // Hookform
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(schema),
  })

  // Login on backend
  const login = async (data: SchemaProps) => {
    setStatus('request')
    setAlertErrors(null)
    setAlertWarnings(null)
    setAlertSuccesses(null)

    try {
      await axios.post('/auth/login', data, {
        withCredentials: true,
      })
      navigate('/home', { state: { logged: true } })
    } catch (error) {
      setAlertErrors([handleAxiosError(error)])
    }

    setStatus('idle')
  }

  return (
    <form onSubmit={handleSubmit(login)}>
      {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}
      {alertWarnings && <Alert type="warning" size="lg" data={alertWarnings} />}
      {alertSuccesses && <Alert type="success" size="lg" data={alertSuccesses} />}

      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="email">
          Email <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="email"
            type="text"
            icon={faEnvelope}
            iconPosition="left"
            autoComplete="email"
            placeholder="Digite o email"
            {...register('email')}
          />
        </div>
        {errors.email && <Alert type="danger" size="sm" data={[errors.email.message || '']} />}
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white" htmlFor="password">
          Senha <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            icon={faLock}
            iconPosition="left"
            autoComplete="current-password"
            placeholder="Digite a senha"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <Alert type="danger" size="sm" data={[errors.password.message || '']} />
        )}
      </div>

      <div className="mb-5 mt-10">
        <Button color="primary" disabled={status === 'request'} loading={status === 'request'}>
          Entrar
        </Button>
      </div>
    </form>
  )
}

export default Form

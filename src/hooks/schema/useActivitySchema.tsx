import z from 'zod'

export const activitySchema = {
  uuid: z
    .string({
      message: 'O uuid deve ser um texto',
    })
    .uuid({
      message: 'Digite um uuid válido',
    })
    .nonempty({
      message: 'O uuid é obrigatório!',
    }),

  description: z
    .string({
      message: 'A descrição deve ser um texto',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  beginDate: z
    .string({
      message: 'A data inicial deve ser um texto',
    })
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{2}) ([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'Digite uma data inicial válida',
    })
    .nonempty({
      message: 'A data inicial é obrigatória!',
    })
    .transform((s) => {
      const [date, time] = s.split(' ')
      const [hour, minute] = time.split(':')
      const [day, month, year] = date.split('/')

      return `20${year}-${month}-${day}T${hour}:${minute}:00`
    }),

  endDate: z
    .string({
      message: 'A data final deve ser um texto',
    })
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{2}) ([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'Digite uma data final válida',
    })
    .nonempty({
      message: 'A data final é obrigatória!',
    })
    .transform((s) => {
      const [date, time] = s.split(' ')
      const [hour, minute] = time.split(':')
      const [day, month, year] = date.split('/')

      return `20${year}-${month}-${day}T${hour}:${minute}:00`
    }),

  hourlyRate: z
    .string({
      message: 'O valor da hora deve ser um texto',
    })
    .regex(/^$|R?\$?\s?\d{1,3}(\.\d{3})*(,\d{1,2})?$/, {
      message: 'Digite um valor da hora válido',
    })
    .nonempty({
      message: 'O valor da hora é obrigatório!',
    }),

  userUuid: z
    .string({
      message: 'O uuid do usuário deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid do usuário válido',
    })
    .nonempty({
      message: 'O uuid do usuário é obrigatório',
    }),

  taskUuid: z
    .string({
      message: 'O uuid da tarefa deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid da tarefa válido',
    })
    .nonempty({
      message: 'O uuid da tarefa é obrigatório',
    }),
}

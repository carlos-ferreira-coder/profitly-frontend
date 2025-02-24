import z from 'zod'

export const taskSchema = {
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

  type: z
    .string({
      message: 'O tipo deve ser um texto',
    })
    .nonempty({
      message: 'O tipo é obrigatório!',
    })
    .refine(
      (s) => {
        const types = ['Activity', 'Expense']
        return types.includes(s)
      },
      {
        message: 'Informe um tipo válido',
      }
    ),

  description: z
    .string({
      message: 'A descrição deve ser um texto',
    })
    .nonempty({
      message: 'A descrição é obrigatória.',
    }),

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
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  cost: z
    .string({
      message: 'O valor do custo deve ser um texto',
    })
    .regex(/^$|R?\$?\s?\d{1,3}(\.\d{3})*(,\d{1,2})?$/, {
      message: 'Digite um valor de custo válido',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  revenue: z
    .string({
      message: 'O valor do lucro deve ser um texto',
    })
    .regex(/^$|R?\$?\s?\d{1,3}(\.\d{3})*(,\d{1,2})?$/, {
      message: 'Digite um valor de lucro válido',
    })
    .nonempty({
      message: 'O valor de lucro é obrigatório.',
    }),

  statusUuid: z
    .string({
      message: 'O uuid de status deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid de status válido',
    })
    .nonempty({
      message: 'O uuid do status é obrigatório',
    }),

  projectUuid: z
    .string({
      message: 'O uuid do projeto deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid do projeto válido',
    })
    .nonempty({
      message: 'O uuid do projeto é obrigatório',
    }),

  userUuid: z
    .string({
      message: 'O uuid do usuário deve ser um texto',
    })
    .regex(
      /^$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      {
        message: 'Informe um uuid de usuário válido',
      }
    )
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  budgetUuid: z
    .string({
      message: 'O uuid do orçamento deve ser um texto',
    })
    .regex(
      /^$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      {
        message: 'Informe um uuid de orçamento válido',
      }
    )
    .transform((s) => (s === '' ? null : s))
    .nullable(),
}

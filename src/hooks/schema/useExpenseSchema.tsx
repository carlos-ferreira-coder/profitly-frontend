import z from 'zod'

export const expenseSchema = {
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
      message: 'O tipo é obrigatória.',
    }),

  description: z
    .string({
      message: 'A descrição deve ser um texto',
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
    .nonempty({
      message: 'O custo é obrigatório!',
    }),

  date: z
    .string({
      message: 'A data deve ser um texto',
    })
    .regex(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{2}) ([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'Digite uma data válida',
    })
    .nonempty({
      message: 'A data é obrigatória!',
    })
    .transform((s) => {
      const [date, time] = s.split(' ')
      const [hour, minute] = time.split(':')
      const [day, month, year] = date.split('/')

      return `20${year}-${month}-${day}T${hour}:${minute}:00`
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

  supplierUuid: z
    .string({
      message: 'O uuid do fornecedor deve ser um texto',
    })
    .regex(
      /^$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      {
        message: 'Informe um uuid de fornecedor válido',
      }
    )
    .transform((s) => (s === '' ? null : s))
    .nullable(),
}

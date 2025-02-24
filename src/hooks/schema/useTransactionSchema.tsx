import z from 'zod'

export const transactionSchema = {
  uuid: z
    .string({
      message: 'O uuid deve ser um texto',
    })
    .uuid({
      message: 'Digite um uuid válido',
    })
    .nonempty({
      message: 'A indentificação é obrigatória!',
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
        const types = ['Expense', 'Income', 'Transfer', 'Loan', 'Adjustment', 'Refund']
        return types.includes(s)
      },
      {
        message: 'Informe um tipo válido',
      }
    ),

  amount: z
    .string({
      message: 'A quantia deve ser um texto',
    })
    .regex(/^$|R?\$?\s?\d{1,3}(\.\d{3})*(,\d{1,2})?$/, {
      message: 'Digite uma quantia válida',
    })
    .nonempty({
      message: 'Informe uma quantia válida',
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

  description: z
    .string({
      message: 'A descrição deve ser um texto',
    })
    .nonempty({
      message: 'A descrição é obrigatória.',
    }),

  clientUuid: z
    .string({
      message: 'O uuid do cliente deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid do cliente válido',
    })
    .nonempty({
      message: 'O uuid do cliente é obrigatório',
    }),

  projectUuid: z
    .string({
      message: 'O uuid do projeto deve ser um texto',
    })
    .regex(
      /^$|^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      {
        message: 'Informe um uuid do projeto válido',
      }
    )
    .transform((s) => (s === '' ? null : s))
    .nullable(),

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
}

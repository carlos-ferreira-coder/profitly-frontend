import z from 'zod'

export const budgetSchema = {
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
}

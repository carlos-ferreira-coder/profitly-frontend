import z from 'zod'

export const clientSchema = {
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
        const types = ['Person', 'Enterprise']
        return types.includes(s)
      },
      {
        message: 'Informe um tipo válido',
      }
    ),

  cpf: z
    .string({
      message: 'O CPF deve ser um texto',
    })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: 'Digite um CPF válido',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  cnpj: z
    .string({
      message: 'O CNPJ deve ser um texto',
    })
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
      message: 'Digite um CNPJ válido',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  name: z
    .string({
      message: 'O nome completo deve ser um texto',
    })
    .nonempty({
      message: 'O nome completo é obrigatório!',
    }),

  fantasy: z
    .string({
      message: 'O nome de usuário deve ser um texto',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  email: z
    .string({
      message: 'O email deve ser um texto',
    })
    .email({
      message: 'Digite um email válido!',
    })
    .nonempty({
      message: 'O email é obrigatório!',
    }),

  phone: z
    .string({
      message: 'O contato deve ser um texto',
    })
    .regex(/^$|^\(\d{2}\)\s\d{1}\s\d{4}-\d{4}$/, {
      message: 'Digite um contato válido',
    })
    .transform((s) => (s === '' ? null : s))
    .nullable(),

  active: z
    .boolean({
      message: 'O campo ativo deve ser booleano',
    })
    .refine((b) => b !== undefined, {
      message: 'O campo ativo é obrigatório!',
    }),
}

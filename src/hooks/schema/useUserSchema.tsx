import z from 'zod'

export const userSchema = {
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

  cpf: z
    .string({
      message: 'O CPF deve ser um texto',
    })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: 'Digite um CPF válido',
    })
    .nonempty({
      message: 'O CPF é obrigatório!',
    }),

  active: z
    .boolean({
      message: 'O campo ativo deve ser booleano',
    })
    .refine((b) => b !== undefined, {
      message: 'O campo ativo é obrigatório!',
    }),

  username: z
    .string({
      message: 'O nome de usuário deve ser um texto',
    })
    .nonempty({
      message: 'O nome de usuário é obrigatório!',
    }),

  name: z
    .string({
      message: 'O nome completo deve ser um texto',
    })
    .nonempty({
      message: 'O nome completo é obrigatório!',
    }),

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

  passwordCurrentOptional: z
    .string({
      message: 'A senha atual deve ser um texto',
    })
    .optional(),

  passwordCurrentNonEmpty: z
    .string({
      message: 'A senha atual deve ser um texto',
    })
    .min(6, {
      message: 'A senha atual deve ter no mínimo 6 dígitos!',
    })
    .nonempty({
      message: 'A atual senha é obrigatória!',
    }),

  passwordNew: z
    .string({
      message: 'A nova senha deve ser um texto',
    })
    .min(6, {
      message: 'A nova senha deve ter no mínimo 6 dígitos!',
    })
    .nonempty({
      message: 'A nova senha é obrigatória!',
    }),

  passwordCheck: z
    .string({
      message: 'A confirmação de senha deve ser um texto',
    })
    .min(6, {
      message: 'A confirmação de senha deve ter no mínimo 6 dígitos!',
    })
    .nonempty({
      message: 'A confirmação de senha é obrigatória!',
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

  authUuid: z
    .string({
      message: 'O cargo/função deve ser um texto',
    })
    .uuid({
      message: 'Selecione um cargo válido!',
    })
    .nonempty({
      message: 'Selecione um cargo válido!',
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
}

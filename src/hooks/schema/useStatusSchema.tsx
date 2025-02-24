import z from 'zod'

export const statusSchema = {
  id: z
    .number({
      message: 'O id deve ser um número',
    })
    .min(1, {
      message: 'Selecione um id válido!',
    }),

  uuid: z
    .string({
      message: 'O uuid deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid válido',
    })
    .nonempty({
      message: 'O uuid é obrigatório',
    }),

  name: z
    .string({
      message: 'O nome completo deve ser um texto',
    })
    .nonempty({
      message: 'O nome completo é obrigatório!',
    }),

  description: z
    .string({
      message: 'A descrição deve ser um texto',
    })
    .nonempty({
      message: 'A descrição é obrigatória!',
    }),

  priority: z
    .string({
      message: 'A prioridade deve ser um texto',
    })
    .regex(/^\d+$/, {
      message: 'Selecione uma prioridade válida!',
    })
    .nonempty({
      message: 'Selecione uma prioridade válida!',
    })
    .transform((s) => parseInt(s)),
}

import z from 'zod'

export const projectSchema = {
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

  name: z
    .string({
      message: 'O nome deve ser um texto',
    })
    .nonempty({
      message: 'O nome é obrigatório!',
    }),

  description: z
    .string({
      message: 'A descrição deve ser um texto',
    })
    .nonempty({
      message: 'A descrição é obrigatória.',
    }),

  active: z
    .boolean({
      message: 'O campo ativo deve ser booleano',
    })
    .refine((b) => b !== undefined, {
      message: 'O campo ativo é obrigatório!',
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

  budgetUuid: z
    .string({
      message: 'O uuid do orçamento deve ser um texto',
    })
    .uuid({
      message: 'Informe um uuid de orçamento válido',
    })
    .nonempty({
      message: 'O uuid do orçamento é obrigatório',
    }),
}

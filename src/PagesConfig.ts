import { ComponentType } from 'react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faHouse,
  faArrowRightToBracket,
  faUserPen,
  faArrowRightFromBracket,
  faUserXmark,
  faUserGear,
  faQuestion,
  faBarsProgress,
  faUser,
  faUserTie,
  faParachuteBox,
  faDiagramProject,
  faMoneyBillTransfer,
  faMoneyBills,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import { AuthProps } from './types/Auth'
import Home from './pages/Home/Index'
import Login from './pages/Auth/Login/Index'
import Logout from './pages/Auth/Logout/Index'
import AuthSelect from './pages/Auth/Select/Index'
import AuthCreate from './pages/Auth/Create/Index'
import AuthUpdate from './pages/Auth/Update/Index'
import AuthDelete from './pages/Auth/Delete/Index'
import StatusSelect from './pages/Status/Select/Index'
import StatusCreate from './pages/Status/Create/Index'
import StatusUpdate from './pages/Status/Update/Index'
import StatusDelete from './pages/Status/Delete/Index'
import ProjectSelect from './pages/Project/Select/Index'
import ProjectCreate from './pages/Project/Create/Index'
import ProjectUpdate from './pages/Project/Update/Index'
import ProjectDelete from './pages/Project/Delete/Index'
import ProjectBudget from './pages/Project/Budget/Index'
import ProjectTasks from './pages/Project/Tasks/Index'
import TransactionSelect from './pages/Transaction/Select/Index'
import TransactionCreate from './pages/Transaction/Create/Index'
import TransactionUpdate from './pages/Transaction/Update/Index'
import TransactionDelete from './pages/Transaction/Delete/Index'
import ClientSelect from './pages/Client/Select/Index'
import ClientCreate from './pages/Client/Create/Index'
import ClientUpdate from './pages/Client/Update/Index'
import ClientDelete from './pages/Client/Delete/Index'
import UserSelect from './pages/User/Select/Index'
import UserCreate from './pages/User/Create/Index'
import UserUpdate from './pages/User/Update/Index'
import UserDelete from './pages/User/Delete/Index'
import SupplierSelect from './pages/Supplier/Select/Index'
import SupplierCreate from './pages/Supplier/Create/Index'
import SupplierUpdate from './pages/Supplier/Update/Index'
import SupplierDelete from './pages/Supplier/Delete/Index'
import ExpenseSelect from './pages/Expense/Select/Index'
import ExpenseCreate from './pages/Expense/Create/Index'
import ExpenseUpdate from './pages/Expense/Update/Index'
import ExpenseDelete from './pages/Expense/Delete/Index'
import ActivitySelect from './pages/Activity/Select/Index'
import ActivityCreate from './pages/Activity/Create/Index'
import ActivityUpdate from './pages/Activity/Update/Index'
import ActivityDelete from './pages/Activity/Delete/Index'

export type PageProps = {
  icon: IconProp
  title: string
  route: string
  useIn: string[]
  protection: string[]
  component: ComponentType
}

export const pages: PageProps[] = [
  {
    title: 'Index',
    route: '/',
    protection: [],
    useIn: [],
    icon: faHouse,
    component: Login,
  },
  {
    title: 'Home',
    route: '/home',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faHouse,
    component: Home,
  },
  {
    title: 'Cargos/Funções',
    route: '/auth/select',
    protection: ['logged', 'admin'],
    useIn: ['Settings'],
    icon: faUserGear,
    component: AuthSelect,
  },
  {
    title: 'Cadastrar Cargo/Função',
    route: '/auth/create',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: AuthCreate,
  },
  {
    title: 'Editar Cargo/Função',
    route: '/auth/update/:id',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: AuthUpdate,
  },
  {
    title: 'Deletar Cargo/Função',
    route: '/auth/delete/:id',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: AuthDelete,
  },
  {
    title: 'Status',
    route: '/status/select',
    protection: ['logged', 'admin'],
    useIn: ['Settings'],
    icon: faBarsProgress,
    component: StatusSelect,
  },
  {
    title: 'Cadastrar Status',
    route: '/status/create',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: StatusCreate,
  },
  {
    title: 'Editar Status',
    route: '/status/update/:id',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: StatusUpdate,
  },
  {
    title: 'Deletar Status',
    route: '/status/delete/:id',
    protection: ['logged', 'admin'],
    useIn: [],
    icon: faQuestion,
    component: StatusDelete,
  },
  {
    title: 'Projetos',
    route: '/project/select',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faDiagramProject,
    component: ProjectSelect,
  },
  {
    title: 'Projeto > Orçamento',
    route: '/project/budget/:uuid',
    protection: ['logged', 'project'],
    useIn: [],
    icon: faQuestion,
    component: ProjectBudget,
  },
  {
    title: 'Projeto > Tarefas',
    route: '/project/tasks/:uuid',
    protection: ['logged', 'project'],
    useIn: [],
    icon: faQuestion,
    component: ProjectTasks,
  },
  {
    title: 'Cadastrar Projeto',
    route: '/project/create',
    protection: ['logged', 'project'],
    useIn: [],
    icon: faQuestion,
    component: ProjectCreate,
  },
  {
    title: 'Editar Projeto',
    route: '/project/update/:uuid',
    protection: ['logged', 'project'],
    useIn: [],
    icon: faQuestion,
    component: ProjectUpdate,
  },
  {
    title: 'Deletar Projeto',
    route: '/project/delete/:uuid',
    protection: ['logged', 'project'],
    useIn: [],
    icon: faQuestion,
    component: ProjectDelete,
  },
  {
    title: 'Despesas',
    route: '/expense/select',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faMoneyBills,
    component: ExpenseSelect,
  },
  {
    title: 'Cadastrar Despesa',
    route: '/expense/create',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ExpenseCreate,
  },
  {
    title: 'Editar Despesa',
    route: '/expense/update/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ExpenseUpdate,
  },
  {
    title: 'Deletar Despesa',
    route: '/expense/delete/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ExpenseDelete,
  },
  {
    title: 'Atividades',
    route: '/activity/select',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faListCheck,
    component: ActivitySelect,
  },
  {
    title: 'Cadastrar Atividades',
    route: '/activity/create',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ActivityCreate,
  },
  {
    title: 'Editar Atividades',
    route: '/activity/update/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ActivityUpdate,
  },
  {
    title: 'Deletar Atividades',
    route: '/activity/delete/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ActivityDelete,
  },
  {
    title: 'Transações',
    route: '/transaction/select',
    protection: ['logged', 'financial'],
    useIn: ['Navigate'],
    icon: faMoneyBillTransfer,
    component: TransactionSelect,
  },
  {
    title: 'Cadastrar Transação',
    route: '/transaction/create',
    protection: ['logged', 'financial'],
    useIn: [],
    icon: faQuestion,
    component: TransactionCreate,
  },
  {
    title: 'Editar Transação',
    route: '/transaction/update/:uuid',
    protection: ['logged', 'financial'],
    useIn: [],
    icon: faQuestion,
    component: TransactionUpdate,
  },
  {
    title: 'Deletar Transação',
    route: '/transaction/delete/:uuid',
    protection: ['logged', 'financial'],
    useIn: [],
    icon: faQuestion,
    component: TransactionDelete,
  },
  {
    title: 'Clientes',
    route: '/client/select',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faUser,
    component: ClientSelect,
  },
  {
    title: 'Cadastrar Cliente',
    route: '/client/create',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ClientCreate,
  },
  {
    title: 'Editar Cliente',
    route: '/client/update/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ClientUpdate,
  },
  {
    title: 'Deletar Cliente',
    route: '/client/delete/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: ClientDelete,
  },
  {
    title: 'Usuários',
    route: '/user/select',
    protection: ['logged'],
    useIn: ['Navigate', 'Settings'],
    icon: faUserTie,
    component: UserSelect,
  },
  {
    title: 'Cadastrar Usuário',
    route: '/user/create',
    protection: ['logged', 'personal'],
    useIn: [],
    icon: faQuestion,
    component: UserCreate,
  },
  {
    title: 'Editar Usuário',
    route: '/user/update/:uuid',
    protection: ['logged'],
    useIn: ['Settings'],
    icon: faUserPen,
    component: UserUpdate,
  },
  {
    title: 'Deletar Usuário',
    route: '/user/delete/:uuid',
    protection: ['logged', 'personal'],
    useIn: [],
    icon: faUserXmark,
    component: UserDelete,
  },
  {
    title: 'Fornecedores',
    route: '/supplier/select',
    protection: ['logged'],
    useIn: ['Navigate'],
    icon: faParachuteBox,
    component: SupplierSelect,
  },
  {
    title: 'Cadastrar Fornecedor',
    route: '/supplier/create',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: SupplierCreate,
  },
  {
    title: 'Editar Fornecedor',
    route: '/supplier/update/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: SupplierUpdate,
  },
  {
    title: 'Deletar Fornecedor',
    route: '/supplier/delete/:uuid',
    protection: ['logged'],
    useIn: [],
    icon: faQuestion,
    component: SupplierDelete,
  },
  {
    title: 'Login',
    route: '/auth/login',
    protection: [],
    useIn: ['Settings'],
    icon: faArrowRightToBracket,
    component: Login,
  },
  {
    title: 'Deslogar',
    route: '/auth/logout',
    protection: [],
    useIn: ['Settings'],
    icon: faArrowRightFromBracket,
    component: Logout,
  },
]

export const getPagesByUseIn = (useIn: string, auth: AuthProps) => {
  return pages
    .filter((page) => page.useIn.includes(useIn))
    .filter((page) => {
      const protections: (keyof AuthProps)[] = ['admin', 'project', 'personal', 'financial']
      return protections.every((protection) => {
        return !page.protection.includes(protection) || auth[protection]
      })
    })
}

import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { TransactionProps } from '../../../types/Transaction'

const List = ({ transactions }: { transactions: TransactionProps[] }) => {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, transactions.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Expense':
        return 'Despesa'
      case 'Income':
        return 'Receita'
      case 'Transfer':
        return 'Transferência'
      case 'Loan':
        return 'Empréstimo'
      case 'Adjustment':
        return 'Ajuste'
      case 'Refund':
        return 'Reembolso'
      default:
        return 'Outro'
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          color="success"
          className="w-50 h-8"
          onClick={() => navigate('/transaction/create/')}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Transação
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={transactions[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-7 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 flex lg:hidden flex-col justify-center space-y-1">
            <p>
              <b>Tipo: </b>
              {getTypeLabel(transactions[key].type)}
            </p>
            <p>
              <b>Quantia: </b>
              {transactions[key].amount}
            </p>
            <p>
              <b>Data: </b>
              {transactions[key].date}
            </p>
            <p>
              <b>Descrição: </b>
              {transactions[key].description}
            </p>
            <p>
              <b>Cliente: </b>
              {transactions[key].client.name}
            </p>
            <p>
              <b>Usuário: </b>
              {transactions[key].user.username}
            </p>
            {transactions[key].project ? (
              <p>
                <b>Projeto: </b>
                {transactions[key].project.name}
              </p>
            ) : null}
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Tipo: </b>
              {getTypeLabel(transactions[key].type)}
            </p>
            <p>
              <b>Quantia: </b>
              {transactions[key].amount}
            </p>
            <p>
              <b>Data: </b>
              {transactions[key].date}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Cliente: </b>
              {transactions[key].client.name}
            </p>
            <p>
              <b>Usuário: </b>
              {transactions[key].user.username}
            </p>
            {transactions[key].project ? (
              <p>
                <b>Projeto: </b>
                {transactions[key].project.name}
              </p>
            ) : null}
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Descrição: </b>
              {transactions[key].description}
            </p>
          </div>

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/transaction/update/${transactions[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/transaction/delete/${transactions[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
        </div>
      ))}

      <Pagination
        itemsLength={transactions.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

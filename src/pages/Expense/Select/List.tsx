import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ExpenseProps } from '../../../types/Expense'

const List = ({ expenses }: { expenses: ExpenseProps[] }) => {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, expenses.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-50 h-8" onClick={() => navigate('/expense/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Despesa
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={expenses[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-7 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 flex lg:hidden flex-col justify-center space-y-1">
            <p>
              <b>Descrição: </b>
              {expenses[key].description}
            </p>
            <p>
              <b>Tipo: </b>
              {expenses[key].type}
            </p>
            <p>
              <b>Custo: </b>
              {expenses[key].cost}
            </p>
            <p>
              <b>Data: </b>
              {expenses[key].date}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Descrição: </b>
              {expenses[key].description}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Tipo: </b>
              {expenses[key].type}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Custo: </b>
              {expenses[key].cost}
            </p>
            <p>
              <b>Data: </b>
              {expenses[key].date}
            </p>
          </div>

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/expense/update/${expenses[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/expense/delete/${expenses[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
        </div>
      ))}

      <Pagination
        itemsLength={expenses.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

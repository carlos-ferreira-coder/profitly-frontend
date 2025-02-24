import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faFileInvoiceDollar,
  faListCheck,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ProjectProps } from '../../../types/Project'
import { currencyToNumber } from '../../../hooks/useCurrency'

const List = ({ projects }: { projects: ProjectProps[] }) => {
  const itemsPerPage = 5
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, projects.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-50 h-8" onClick={() => navigate('/project/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Projeto
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={projects[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-9 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 flex lg:hidden flex-col justify-center space-y-1">
            <p>
              <b>Nome: </b>
              {projects[key].name}
            </p>
            <p>
              <b>Status: </b>
              {projects[key].status.name}
              {projects[key].active ? (
                <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
              ) : (
                <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
              )}
            </p>
            <p>
              <b>Cliente: </b>
              {projects[key].client.name}
            </p>
            <p>
              <b>Descrição: </b>
              {projects[key].description}
            </p>
            <p>
              <b>Data inicial: </b>
              {projects[key].beginDate}
            </p>
            <p>
              <b>Data final: </b>
              {projects[key].endDate}
            </p>

            {projects[key].financial ? (
              <>
                <p>
                  <b>Total previsto: </b>
                  {projects[key].prevTotal}
                </p>
                <p>
                  <b>Custo previsto: </b>
                  {projects[key].prevCost}
                </p>
                <p>
                  <b>Lucro previsto: </b>
                  {projects[key].prevRevenue}
                </p>

                <p>
                  <b>Total atual: </b>
                  {projects[key].total}
                </p>
                <p>
                  <b>Custo atual: </b>
                  {projects[key].cost}
                </p>
                <p>
                  <b>Lucro atual: </b>
                  {projects[key].revenue}
                </p>
                <p>
                  <b>Receita corrente: </b>
                  {projects[key].currentIncome}
                </p>
                <p>
                  <b>Despesa corrente: </b>
                  {projects[key].currentExpense}
                </p>
                <p>
                  <b>Lucro corrente: </b>
                  {projects[key].currentRevenue}
                </p>
              </>
            ) : null}
          </div>

          {projects[key].financial ? (
            <>
              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Nome: </b>
                  {projects[key].name}
                </p>
                <p>
                  <b>Data inicial: </b>
                  {projects[key].beginDate}
                </p>
                <p>
                  <b>Data final: </b>
                  {projects[key].endDate}
                </p>
              </div>

              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Total previsto: </b>
                  {projects[key].prevTotal}
                </p>
                <p>
                  <b>Custo previsto: </b>
                  {projects[key].prevCost}
                </p>
                <p>
                  <b>Lucro previsto: </b>
                  {projects[key].prevRevenue}
                </p>
              </div>

              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Total atual: </b>
                  {projects[key].total}
                </p>
                <p>
                  <b>Custo atual: </b>
                  {projects[key].cost}
                </p>
                <p>
                  <b>Lucro atual: </b>
                  {projects[key].revenue}
                </p>
              </div>

              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Receita corrente: </b>
                  {projects[key].currentIncome}
                </p>
                <p>
                  <b>Despesa corrente: </b>
                  {projects[key].currentExpense}
                </p>
                <p>
                  <b>Lucro corrente: </b>
                  {projects[key].currentRevenue}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Nome: </b>
                  {projects[key].name}
                </p>
              </div>

              <div className="col-span-4 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Descrição: </b>
                  {projects[key].description}
                </p>
              </div>

              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Data inicial: </b>
                  {projects[key].beginDate}
                </p>
                <p>
                  <b>Data final: </b>
                  {projects[key].endDate}
                </p>
              </div>
            </>
          )}

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/project/update/${projects[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="success"
              className="w-8 h-8"
              onClick={() => navigate(`/project/budget/${projects[key].budgetUuid}`)}
            >
              <FontAwesomeIcon icon={faFileInvoiceDollar} />
            </Button>

            {currencyToNumber(projects[key].prevTotal, 'BRL') !== 0 ? (
              <Button
                color="warning"
                className="w-8 h-8"
                onClick={() => navigate(`/project/tasks/${projects[key].uuid}`)}
              >
                <FontAwesomeIcon icon={faListCheck} />
              </Button>
            ) : null}

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/project/delete/${projects[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>

          {projects[key].financial ? (
            <>
              <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Cliente: </b>
                  {projects[key].client.name}
                </p>
                <p>
                  <b>Status: </b>
                  {projects[key].status.name}
                  {projects[key].active ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
                  )}
                </p>
              </div>

              <div className="col-span-7 lg:flex hidden flex-col justify-center space-y-1">
                <p>
                  <b>Descrição: </b>
                  {projects[key].description}
                </p>
              </div>
            </>
          ) : null}
        </div>
      ))}

      <Pagination
        itemsLength={projects.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

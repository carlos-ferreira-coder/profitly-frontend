import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ActivityProps } from '../../../types/Activity'

const List = ({ activitys }: { activitys: ActivityProps[] }) => {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, activitys.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-50 h-8" onClick={() => navigate('/activity/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Atividades
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={activitys[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-7 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 flex lg:hidden flex-col justify-center space-y-1">
            <p>
              <b>Descrição: </b>
              {activitys[key].description}
            </p>
            <p>
              <b>Data inicial: </b>
              {activitys[key].beginDate}
            </p>
            <p>
              <b>Data final: </b>
              {activitys[key].endDate}
            </p>
            <p>
              <b>Valor da hora: </b>
              {activitys[key].hourlyRate}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Descrição: </b>
              {activitys[key].description}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Valor da hora: </b>
              {activitys[key].hourlyRate}
            </p>
          </div>

          <div className="col-span-2 lg:flex hidden flex-col justify-center space-y-1">
            <p>
              <b>Data inicial: </b>
              {activitys[key].beginDate}
            </p>
            <p>
              <b>Data final: </b>
              {activitys[key].endDate}
            </p>
          </div>

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/activity/update/${activitys[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/activity/delete/${activitys[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
        </div>
      ))}

      <Pagination
        itemsLength={activitys.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

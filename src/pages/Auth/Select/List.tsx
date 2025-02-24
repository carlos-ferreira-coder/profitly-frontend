import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { AuthProps } from '../../../types/Auth'

const List = ({ auths }: { auths: AuthProps[] }) => {
  const itemsPerPage = 8
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, auths.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-60 h-8" onClick={() => navigate('/auth/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Cargo / Função
        </Button>
      </div>

      {auths.length &&
        pageRange.map((key) => (
          <div
            key={auths[key].uuid}
            className="grid grid-cols-4 gap-4 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
          >
            <div className="col-span-1 flex flex-col justify-center space-y-1">
              <b>{auths[key].type}: </b>
            </div>

            <div className="col-span-2 lg:hidden flex flex-col justify-center space-y-1">
              <p>
                <b>Administrador: </b> {auths[key].admin === true ? 'sim' : 'não'}
              </p>
              <p>
                <b>Editar Projetos: </b> {auths[key].project === true ? 'sim' : 'não'}
              </p>
              <p>
                <b>Informações pessoais: </b> {auths[key].personal === true ? 'sim' : 'não'}
              </p>
              <p>
                <b>Informações financeiras: </b> {auths[key].financial === true ? 'sim' : 'não'}
              </p>
            </div>

            <div className="col-span-1 hidden lg:flex flex-col justify-center space-y-1">
              <p>
                <b>Administração: </b> {auths[key].admin === true ? 'sim' : 'não'}
              </p>
              <p>
                <b>Editar Projetos: </b> {auths[key].project === true ? 'sim' : 'não'}
              </p>
            </div>
            <div className="col-span-1 hidden lg:flex flex-col justify-center space-y-1">
              <p>
                <b>Informações pessoais: </b> {auths[key].personal === true ? 'sim' : 'não'}
              </p>
              <p>
                <b>Informações financeiras: </b> {auths[key].financial === true ? 'sim' : 'não'}
              </p>
            </div>

            <div className="col-span-1 flex flex-col justify-center items-center space-y-2">
              <Button
                color="primary"
                className="w-8 h-8"
                onClick={() => navigate(`/auth/update/${auths[key].uuid}`)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>

              <Button
                color="danger"
                className="w-8 h-8"
                onClick={() => navigate(`/auth/delete/${auths[key].uuid}`)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </div>
          </div>
        ))}

      <Pagination
        itemsLength={auths.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

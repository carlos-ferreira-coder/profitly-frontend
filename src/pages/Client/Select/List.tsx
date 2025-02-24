import { useState } from 'react'
import { Pagination } from '../../../hooks/usePagination'
import Button from '../../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faCircleXmark,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { ClientProps } from '../../../types/Client'

const List = ({ clients }: { clients: ClientProps[] }) => {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, clients.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-50 h-8" onClick={() => navigate('/client/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Usuário
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={clients[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-7 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 lg:hidden flex flex-col justify-center space-y-2">
            {clients[key].type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b>
                  Pessoa
                </p>
                <p>
                  <b>Nome: </b>
                  {clients[key].name}
                  {clients[key].active ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
                  )}
                </p>
                <p>
                  <b>CPF: </b>
                  {clients[key].cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b>Empresa
                </p>
                <p>
                  <b>Nome: </b>
                  {clients[key].name}
                  {clients[key].active ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
                  )}
                </p>
                <p>
                  <b>Nome Fantasia: </b>
                  {clients[key].fantasy}
                </p>
                <p>
                  <b>CNPJ: </b>
                  {clients[key].cnpj}
                </p>
              </>
            )}

            <p>
              <b>Email: </b> {clients[key].email}
            </p>
            {clients[key].phone ? (
              <p>
                <b>Contato: </b>
                {clients[key].phone}
              </p>
            ) : null}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            {clients[key].type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b>
                  Pessoa
                </p>
                <p>
                  <b>CPF: </b>
                  {clients[key].cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b>Empresa
                </p>
                <p>
                  <b>CNPJ: </b>
                  {clients[key].cnpj}
                </p>
              </>
            )}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            <p>
              <b>Nome: </b>
              {clients[key].name}
              {clients[key].active ? (
                <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
              ) : (
                <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
              )}
            </p>
            {clients[key].type === 'Person' ? null : (
              <>
                <p>
                  <b>Nome Fantasia: </b>
                  {clients[key].fantasy}
                </p>
              </>
            )}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            <p>
              <b>Email: </b> {clients[key].email}
            </p>
            {clients[key].phone ? (
              <p>
                <b>Contato: </b>
                {clients[key].phone}
              </p>
            ) : null}
          </div>

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/client/update/${clients[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/client/delete/${clients[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
        </div>
      ))}

      <Pagination
        itemsLength={clients.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

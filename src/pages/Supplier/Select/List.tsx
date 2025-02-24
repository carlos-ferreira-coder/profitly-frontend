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
import { SupplierProps } from '../../../types/Supplier'

const List = ({ suppliers }: { suppliers: SupplierProps[] }) => {
  const itemsPerPage = 10
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(0)

  const start = currentPage * itemsPerPage
  const end = Math.min((currentPage + 1) * itemsPerPage - 1, suppliers.length - 1)
  const pageRange = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <>
      <div className="flex justify-end">
        <Button color="success" className="w-50 h-8" onClick={() => navigate('/supplier/create/')}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Adicionar Fornecedor
        </Button>
      </div>

      {pageRange.map((key) => (
        <div
          key={suppliers[key].uuid}
          className="grid grid-cols-6 lg:grid-cols-7 gap-2 my-3 px-3 lg:px-5 py-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
        >
          <div className="col-span-5 lg:hidden flex flex-col justify-center space-y-2">
            {suppliers[key].type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b>
                  Pessoa
                </p>
                <p>
                  <b>Nome: </b>
                  {suppliers[key].name}
                  {suppliers[key].active ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
                  )}
                </p>
                <p>
                  <b>CPF: </b>
                  {suppliers[key].cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b>Empresa
                </p>
                <p>
                  <b>Nome: </b>
                  {suppliers[key].name}
                  {suppliers[key].active ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
                  )}
                </p>
                <p>
                  <b>Nome Fantasia: </b>
                  {suppliers[key].fantasy}
                </p>
                <p>
                  <b>CNPJ: </b>
                  {suppliers[key].cnpj}
                </p>
              </>
            )}

            <p>
              <b>Email: </b> {suppliers[key].email}
            </p>
            {suppliers[key].phone ? (
              <p>
                <b>Contato: </b>
                {suppliers[key].phone}
              </p>
            ) : null}
            {suppliers[key].address ? (
              <p>
                <b>Endereço: </b>
                {suppliers[key].address}
              </p>
            ) : null}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            {suppliers[key].type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b>
                  Pessoa
                </p>
                <p>
                  <b>CPF: </b>
                  {suppliers[key].cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b>Empresa
                </p>
                <p>
                  <b>CNPJ: </b>
                  {suppliers[key].cnpj}
                </p>
              </>
            )}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            <p>
              <b>Nome: </b>
              {suppliers[key].name}
              {suppliers[key].active ? (
                <FontAwesomeIcon icon={faCircleCheck} className="ml-2 text-success" />
              ) : (
                <FontAwesomeIcon icon={faCircleXmark} className="ml-2 text-danger" />
              )}
            </p>
            {suppliers[key].type === 'Person' ? null : (
              <>
                <p>
                  <b>Nome Fantasia: </b>
                  {suppliers[key].fantasy}
                </p>
              </>
            )}
          </div>

          <div className="col-span-2 hidden lg:flex flex-col justify-center space-y-2">
            <p>
              <b>Email: </b> {suppliers[key].email}
            </p>
            {suppliers[key].phone ? (
              <p>
                <b>Contato: </b>
                {suppliers[key].phone}
              </p>
            ) : null}
            {suppliers[key].address ? (
              <p>
                <b>Endereço: </b>
                {suppliers[key].address}
              </p>
            ) : null}
          </div>

          <div className="col-span-1 flex flex-col justify-center items-center space-y-6 lg:space-y-2">
            <Button
              color="primary"
              className="w-8 h-8"
              onClick={() => navigate(`/supplier/update/${suppliers[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>

            <Button
              color="danger"
              className="w-8 h-8"
              onClick={() => navigate(`/supplier/delete/${suppliers[key].uuid}`)}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </div>
        </div>
      ))}

      <Pagination
        itemsLength={suppliers.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}

export default List

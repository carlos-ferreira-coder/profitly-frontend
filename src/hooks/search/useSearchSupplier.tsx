import { useEffect, useState } from 'react'
import { Input } from '../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../services/Axios'
import Alert from '../../components/Alert/Index'
import Loader from '../../components/Loader'
import Button from '../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { SupplierProps } from '../../types/Supplier'

const SearchSupplier = ({
  supplier,
  setSupplier,
}: {
  supplier: SupplierProps | null
  setSupplier: (value: SupplierProps | null) => void
}) => {
  const [search, setSearch] = useState<string | null>('')
  const [suppliers, setSuppliers] = useState<SupplierProps[] | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get Suppliers
  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const { data } = await axios.get('supplier/select/all', {
          withCredentials: true,
        })
        setSuppliers(data)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getSuppliers()
  }, [])

  useEffect(() => {
    if (!supplier) setSearch('')
  }, [supplier])

  return (
    <>
      {supplier ? (
        <div className="grid grid-cols-6 p-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          <div className="col-span-5">
            {supplier.type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b> Pessoa
                </p>
                <p>
                  <b>Nome: </b> {supplier.name}
                </p>
                <p>
                  <b>CPF: </b> {supplier.cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b> Empresa
                </p>
                <p>
                  <b>Nome: </b> {supplier.name}
                </p>
                <p>
                  <b>CPF: </b> {supplier.cnpj}
                </p>
              </>
            )}
          </div>
          <div className="col-span-1 flex flex-col justify-center items-center">
            <Button
              color="danger"
              type="button"
              className="w-8 h-8"
              onClick={() => {
                setSupplier(null)
                setSearch('')
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}

          <Input
            placeholder="Buscar..."
            value={search || ''}
            onChange={(e) => setSearch(e.target.value)}
          />

          {suppliers ? (
            search === '' ? (
              <Button
                color="primary"
                type="button"
                className="mt-2"
                onClick={() => setSearch(null)}
              >
                Mostrar todos
              </Button>
            ) : (
              (search
                ? suppliers.filter(
                    (supplier) =>
                      supplier.cpf?.includes(search) ||
                      supplier.cnpj?.includes(search) ||
                      supplier.name.includes(search) ||
                      supplier.fantasy?.includes(search)
                  )
                : suppliers
              ).map((supplier) => (
                <div
                  key={supplier.uuid}
                  className="grid grid-cols-6 mt-2 w-full p-3 shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
                >
                  <div className="col-span-5">
                    {supplier.type === 'Person' ? (
                      <>
                        <p>
                          <b>Tipo: </b> Pessoa
                        </p>
                        <p>
                          <b>Nome: </b> {supplier.name}
                        </p>
                        <p>
                          <b>CPF: </b> {supplier.cpf}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <b>Tipo: </b> Empresa
                        </p>
                        <p>
                          <b>Nome: </b> {supplier.name}
                        </p>
                        <p>
                          <b>CPF: </b> {supplier.cnpj}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-span-1 flex flex-col justify-center items-center">
                    <Button
                      color="primary"
                      type="button"
                      className="w-8 h-8"
                      onClick={() => setSupplier(supplier)}
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                  </div>
                </div>
              ))
            )
          ) : (
            <Loader />
          )}
        </div>
      )}
    </>
  )
}

export default SearchSupplier

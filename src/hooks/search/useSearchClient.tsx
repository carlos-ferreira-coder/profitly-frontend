import { useEffect, useState } from 'react'
import { Input } from '../../components/Form/Input'
import { ClientProps } from '../../types/Client'
import { api as axios, handleAxiosError } from '../../services/Axios'
import Alert from '../../components/Alert/Index'
import Loader from '../../components/Loader'
import Button from '../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'

const SearchClient = ({
  client,
  setClient,
}: {
  client: ClientProps | null
  setClient: (value: ClientProps | null) => void
}) => {
  const [search, setSearch] = useState<string | null>('')
  const [clients, setClients] = useState<ClientProps[] | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get Clients
  useEffect(() => {
    const getClients = async () => {
      try {
        const { data } = await axios.get('client/select/all', {
          withCredentials: true,
        })
        setClients(data)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getClients()
  }, [])

  useEffect(() => {
    if (!client) setSearch('')
  }, [client])

  return (
    <>
      {client ? (
        <div className="grid grid-cols-6 p-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          <div className="col-span-5">
            {client.type === 'Person' ? (
              <>
                <p>
                  <b>Tipo: </b> Pessoa
                </p>
                <p>
                  <b>Nome: </b> {client.name}
                </p>
                <p>
                  <b>CPF: </b> {client.cpf}
                </p>
              </>
            ) : (
              <>
                <p>
                  <b>Tipo: </b> Empresa
                </p>
                <p>
                  <b>Nome: </b> {client.name}
                </p>
                <p>
                  <b>CPF: </b> {client.cnpj}
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
                setClient(null)
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

          {clients ? (
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
                ? clients.filter(
                    (client) =>
                      client.cpf?.includes(search) ||
                      client.cnpj?.includes(search) ||
                      client.name.includes(search) ||
                      client.fantasy?.includes(search)
                  )
                : clients
              ).map((client) => (
                <div
                  key={client.uuid}
                  className="grid grid-cols-6 mt-2 w-full p-3 shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
                >
                  <div className="col-span-5">
                    {client.type === 'Person' ? (
                      <>
                        <p>
                          <b>Tipo: </b> Pessoa
                        </p>
                        <p>
                          <b>Nome: </b> {client.name}
                        </p>
                        <p>
                          <b>CPF: </b> {client.cpf}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <b>Tipo: </b> Empresa
                        </p>
                        <p>
                          <b>Nome: </b> {client.name}
                        </p>
                        <p>
                          <b>CPF: </b> {client.cnpj}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="col-span-1 flex flex-col justify-center items-center">
                    <Button
                      color="primary"
                      type="button"
                      className="w-8 h-8"
                      onClick={() => setClient(client)}
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

export default SearchClient

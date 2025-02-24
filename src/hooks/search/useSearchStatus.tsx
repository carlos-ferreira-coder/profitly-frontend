import { useEffect, useState } from 'react'
import { Input } from '../../components/Form/Input'
import { StatusProps } from '../../types/Status'
import { api as axios, handleAxiosError } from '../../services/Axios'
import Alert from '../../components/Alert/Index'
import Loader from '../../components/Loader'
import Button from '../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'

const SearchStatus = ({
  status,
  setStatus,
}: {
  status: StatusProps | null
  setStatus: (value: StatusProps | null) => void
}) => {
  const [search, setSearch] = useState<string | null>('')
  const [statuss, setStatuss] = useState<StatusProps[] | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get status
  useEffect(() => {
    const getStatus = async () => {
      try {
        const { data } = await axios.get('status/select/all', {
          withCredentials: true,
        })
        setStatuss(data)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getStatus()
  }, [])

  useEffect(() => {
    if (!status) setSearch('')
  }, [status])

  return (
    <>
      {status ? (
        <div className="grid grid-cols-6 p-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          <div className="col-span-5">
            <p>
              <b>Nome: </b> {status.name}
            </p>
            <p>
              <b>Descrição: </b> {status.description}
            </p>
            <p>
              <b>Prioridate: </b> {status.priority}
            </p>
          </div>
          <div className="col-span-1 flex flex-col justify-center items-center">
            <Button
              color="danger"
              type="button"
              className="w-8 h-8"
              onClick={() => {
                setStatus(null)
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

          {statuss ? (
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
                ? statuss.filter(
                    (stat) => stat.name.includes(search) || stat.description.includes(search)
                  )
                : statuss
              ).map((stat) => (
                <div
                  key={stat.uuid}
                  className="grid grid-cols-6 mt-2 w-full p-3 shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
                >
                  <div className="col-span-5">
                    <p>
                      <b>Nome: </b> {stat.name}
                    </p>
                    <p>
                      <b>Descrição: </b> {stat.description}
                    </p>
                    <p>
                      <b>Prioridade: </b> {stat.priority}
                    </p>
                  </div>
                  <div className="col-span-1 flex flex-col justify-center items-center">
                    <Button
                      color="primary"
                      type="button"
                      className="w-8 h-8"
                      onClick={() => setStatus(stat)}
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

export default SearchStatus

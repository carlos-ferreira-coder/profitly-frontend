import { useEffect, useState } from 'react'
import Breadcrumb from '../../../components/Breadcrumb'
import Filter from './Filter'
import List from './List'
import { api as axios, handleAxiosError } from '../../../services/Axios'
import { useLocation } from 'react-router-dom'
import { UserProps } from '../../../types/User'
import { AuthProps } from '../../../types/Auth'
import Alert from '../../../components/Alert/Index'
import Loader from '../../../components/Loader'

const Select = () => {
  const location = useLocation()
  const [auth, setAuth] = useState<AuthProps | null>(null)
  const [auths, setAuths] = useState<AuthProps[] | null>(null)
  const [users, setUsers] = useState<UserProps[] | null>(null)
  const [filtering, setFiltering] = useState<'idle' | 'filter' | 'reset'>('idle')
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get auths
  useEffect(() => {
    const getAuthOptions = async () => {
      try {
        const [resAuth, resAuths] = await Promise.all([
          axios.get('/auth/select/this', { withCredentials: true }),
          axios.get('/auth/select/all', { withCredentials: true }),
        ])

        setAuth(resAuth.data[0])
        setAuths(resAuths.data)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getAuthOptions()
  }, [])

  // Get Users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axios.get(`user/select/all${location.search}`, {
          withCredentials: true,
        })
        setUsers(data)
      } catch (error) {
        setAlertErrors((prevErrors) =>
          prevErrors ? [...prevErrors, handleAxiosError(error)] : [handleAxiosError(error)]
        )
      }

      setFiltering('idle')
    }
    getUsers()
  }, [location.search])

  return (
    <>
      <Breadcrumb pageName="Listar Usuários" />

      <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}

          {auth && auths && users ? (
            <>
              <div className="block w-full md:w-2/6 lg:w-3/12 md:border-r-2 border-stroke dark:border-strokedark">
                <div className="p-7">
                  <Filter
                    auths={auths}
                    auth={auth.personal}
                    filtering={filtering}
                    setFiltering={setFiltering}
                  />
                </div>
              </div>

              <div className="block w-full md:w-4/6 lg:w-9/12">
                <div className="p-7">
                  <List users={users} auth={auth.personal} />
                </div>
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  )
}

export default Select

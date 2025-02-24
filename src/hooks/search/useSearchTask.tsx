import { useEffect, useState } from 'react'
import { Input } from '../../components/Form/Input'
import { api as axios, handleAxiosError } from '../../services/Axios'
import Alert from '../../components/Alert/Index'
import Loader from '../../components/Loader'
import Button from '../../components/Form/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { TaskProps } from '../../types/Task'

const SearchTask = ({
  task,
  setTask,
}: {
  task: TaskProps | null
  setTask: (value: TaskProps | null) => void
}) => {
  const [search, setSearch] = useState<string | null>('')
  const [tasks, setTasks] = useState<TaskProps[] | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        const { data } = await axios.get('task/select/all', {
          withCredentials: true,
        })
        setTasks(data)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getTasks()
  }, [])

  useEffect(() => {
    if (!task) setSearch('')
  }, [task])

  return (
    <>
      {task ? (
        <div className="grid grid-cols-6 p-3 text-sm text-black dark:text-white shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50">
          <div className="col-span-5">
            <p>
              <b>Descrição: </b> {task.description}
            </p>
          </div>
          <div className="col-span-1 flex flex-col justify-center items-center">
            <Button
              color="danger"
              type="button"
              className="w-8 h-8"
              onClick={() => {
                setTask(null)
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

          {tasks ? (
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
              (search ? tasks.filter((task) => task.description.includes(search)) : tasks).map(
                (task) => (
                  <div
                    key={task.uuid}
                    className="grid grid-cols-6 mt-2 w-full p-3 shadow-1 rounded-md border border-stroke dark:border-strokedark dark:bg-form-input/50"
                  >
                    <div className="col-span-5">
                      <p>
                        <b>Descrição: </b> {task.description}
                      </p>
                    </div>
                    <div className="col-span-1 flex flex-col justify-center items-center">
                      <Button
                        color="primary"
                        type="button"
                        className="w-8 h-8"
                        onClick={() => setTask(task)}
                      >
                        <FontAwesomeIcon icon={faAngleRight} />
                      </Button>
                    </div>
                  </div>
                )
              )
            )
          ) : (
            <Loader />
          )}
        </div>
      )}
    </>
  )
}

export default SearchTask

import { api as axios, handleAxiosError } from '../../../services/Axios'
import Breadcrumb from '../../../components/Breadcrumb'
import Alert from '../../../components/Alert/Index'
import LogoDark from '../../../images/logo/logo-dark.png'
import Logo from '../../../images/logo/logo.png'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ProjectProps } from '../../../types/Project'
import Form from './Form'
import Loader from '../../../components/Loader'

const Delete = () => {
  const { uuid } = useParams()
  const [project, setProject] = useState<ProjectProps | null>(null)
  const [alertErrors, setAlertErrors] = useState<(string | JSX.Element)[] | null>(null)

  // Get project
  useEffect(() => {
    const getProject = async () => {
      try {
        const {
          data: { 0: resProject },
        } = await axios.get(`/project/select/${uuid}`, {
          withCredentials: true,
        })
        setProject(resProject)
      } catch (error) {
        setAlertErrors([handleAxiosError(error)])
      }
    }

    getProject()
  }, [uuid])

  return (
    <>
      <Breadcrumb pageName="Deletar Projeto" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          {alertErrors && <Alert type="danger" size="lg" data={alertErrors} />}

          {project ? (
            <>
              <div className="hidden w-full xl:block xl:w-1/2">
                <div className="py-17.5 px-26 text-center">
                  <div className="mb-5.5 inline-block h-50 w-50">
                    <img className="block dark:hidden" src={Logo} alt="Logo" />
                    <img className="hidden dark:block" src={LogoDark} alt="Logo" />
                  </div>

                  <p className="2xl:px-20 text-red-400">
                    Deletar uma projeto é uma ação irreversível e definitiva, resultando na perda
                    permanente de todos os dados associados. Essa decisão deve ser tomada com
                    extrema cautela. Recomendamos fortemente considerar a opção de inativar o
                    projeto, preservando os dados para eventuais necessidades futuras.
                  </p>
                </div>
              </div>

              <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Deletar Projeto
                  </h2>

                  <Form project={project} />
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

export default Delete

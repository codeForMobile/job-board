import { useQuery, useMutation } from '@apollo/client'
import {
  companyByIdQuery,
  JobByIdQuery,
  jobsQuery,
  createJobMutation,
} from './queries'

export function useCompany(id) {
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: { id },
  })
  return { company: data?.company, loading, error: Boolean(error) }
}

export function useJobById(id) {
  const { data, loading, error } = useQuery(JobByIdQuery, {
    variables: { id },
  })
  return { job: data?.job, loading, error: Boolean(error) }
}

export function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: 'network-only',
  })
  return { jobs: data?.jobs, loading, error: Boolean(error) }
}

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation)
  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: JobByIdQuery,
          variables: {
            id: data.job.id,
          },
          data,
        })
      },
    })
    return job
  }
  return {
    createJob,
    loading,
  }
}

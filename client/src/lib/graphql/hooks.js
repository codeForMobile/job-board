import { useQuery } from '@apollo/client'
import { companyByIdQuery, JobByIdQuery, jobsQuery } from './queries'

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

export function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
  })
  return { jobs: data?.jobs, loading, error: Boolean(error) }
}

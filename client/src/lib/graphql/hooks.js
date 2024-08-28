import { useQuery } from '@apollo/client'
import { companyByIdQuery } from './queries'

export function useCompany(id) {
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: { id },
  })
  return { company: data?.company, loading, error: Boolean(error) }
}

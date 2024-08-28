import { useParams } from 'react-router'
import { useQuery } from '@apollo/client'
import { companyByIdQuery } from '../lib/graphql/queries'
import JobList from '../components/JobList'

function CompanyPage() {
  const { companyId } = useParams()
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  })

  console.log('[CompanyPage] state:', { data, loading, error })

  if (loading) {
    return <div>Loading Company....</div>
  }

  if (error) {
    return <div>Data unavaialble</div>
  }

  const { company } = data

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  )
}

export default CompanyPage

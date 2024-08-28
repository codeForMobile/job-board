import { useParams } from 'react-router'
import JobList from '../components/JobList'
import { useCompany } from '../lib/graphql/hooks'

function CompanyPage() {
  const { companyId } = useParams()
  const { loading, error, company } = useCompany(companyId)

  console.log('[CompanyPage] state:', { company, loading, error })

  if (loading) {
    return <div>Loading Company....</div>
  }

  if (error) {
    return <div>Data unavaialble</div>
  }

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

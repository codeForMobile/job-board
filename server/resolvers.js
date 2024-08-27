import { GraphQLError } from 'graphql'
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js'
import { getCompany } from './db/companies.js'

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id)
      if (!company) {
        throw notFoundError('No Company found with id ' + id)
      }
      return company
    },
    job: async (_root, { id }) => {
      const job = await getJob(id)
      if (!job) {
        throw notFoundError('No job was found for id ' + id)
      }
      return job
    },
    jobs: () => getJobs(),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    company: (job) => {
      return getCompany(job.companyId)
    },
    date: (job) => toIsoDate(job.createdAt),
  },
}

function notFoundError(msg) {
  throw new GraphQLError(msg, {
    extensions: { code: 'NOT_FOUND' },
  })
}

const toIsoDate = (value) => {
  return value.slice(0, 'yyyy-mm-dd'.length)
}

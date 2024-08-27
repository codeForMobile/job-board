import { GraphQLError } from 'graphql'
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from './db/jobs.js'
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

  Mutation: {
    createJob: (_root, { input: { title, description } }) => {
      const companyId = 'FjcJCHJALA4i'
      return createJob({ companyId, title, description })
    },
    deleteJob: (_root, { id }) => {
      return deleteJob(id)
    },
    updateJob: (_root, { input: { id, title, description } }) => {
      return updateJob({ id, title, description })
    },
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

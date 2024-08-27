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
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing user')
      }
      const companyId = user.companyId
      return createJob({ companyId: companyId, title, description })
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing user')
      }
      const job = await deleteJob(id, user.companyId)
      if (!job) {
        throw notFoundError('Not authorized to delete job with id ' + id)
      }
      return job
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizedError('Missing user')
      }
      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      })
      if (!job) {
        throw notFoundError('Not authorized to update job with id ' + id)
      }
      return job
    },
  },
}

function notFoundError(msg) {
  throw new GraphQLError(msg, {
    extensions: { code: 'NOT_FOUND' },
  })
}

function unauthorizedError(msg) {
  throw new GraphQLError(msg, {
    extensions: { code: 'NOT_AUTHORIZED' },
  })
}

const toIsoDate = (value) => {
  return value.slice(0, 'yyyy-mm-dd'.length)
}

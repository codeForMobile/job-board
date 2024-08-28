import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  concat,
  createHttpLink,
  gql,
} from '@apollo/client'
import { getAccessToken } from '../auth'

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
  return forward(operation)
})

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
})

export async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
        }
      }
    }
  `
  const { data } = await apolloClient.query({ query, variables: { id } })
  return data.company
}

const jobDetailFragment = gql`
  fragment JobDetails on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`

const JobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`

export async function getJob(id) {
  const { data } = await apolloClient.query({
    query: JobByIdQuery,
    variables: { id },
  })
  return data.job
}

export async function getJobs() {
  const query = gql`
    query jobs {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only',
  })
  return data.jobs
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation createJob($input: createJobInput!) {
      job: createJob(input: $input) {
        ...JobDetails
      }
    }
    ${jobDetailFragment}
  `

  const { data } = await apolloClient.mutate({
    mutation,
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
  return data.job
}

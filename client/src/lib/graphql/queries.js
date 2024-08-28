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

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
})

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

export const companyByIdQuery = gql`
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

export const JobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`

export const jobsQuery = gql`
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

export const createJobMutation = gql`
  mutation createJob($input: createJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`

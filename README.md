## GraphQL Job Board

Graphql based job board to allow users to 

- login
- logout
- post a job

Other features

- route protect for create job
- update & delete jobs are implemented only in backend and can be approached by graphql studio

### Technlogoies involved and branches

- `master` implementation with lightweight library `GraphQL-Request`
- `useQuery` refactoring above with React `useQuery` and custom hooks
- `dataloader` optimizing above with the `dataloader` library

#### Other Technlogies 

- `knex` is used for db persistence. Locally stored db is used.
- `express` is used under the hood for apolloClient implementation.
- `jwt` is used for auth tokens.

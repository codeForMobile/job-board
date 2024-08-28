import cors from 'cors'
import express from 'express'
import { ApolloServer } from '@apollo/server'
import { readFile } from 'node:fs/promises'
import { expressMiddleware as apolloMiddelware } from '@apollo/server/express4'
import { authMiddleware, handleLogin } from './auth.js'
import { resolvers } from './resolvers.js'
import { getUser } from './db/users.js'
import { createCompanyLoader } from './db/companies.js'

const PORT = 9000

const app = express()
app.use(cors(), express.json(), authMiddleware)

app.post('/login', handleLogin)

const typeDefs = await readFile('./schema.graphql', 'utf8')

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

async function getContext({ req }) {
  const companyLoader = createCompanyLoader()
  const context = { companyLoader }

  if (req.auth) {
    context.user = await getUser(req.auth.sub)
  }
  return context
}

await apolloServer.start()
app.use('/graphql', apolloMiddelware(apolloServer, { context: getContext }))

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`GraphQL running on http://localhost:${PORT}/graphql`)
})

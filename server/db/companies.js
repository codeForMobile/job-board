import { connection } from './connection.js'
import Dataloader from 'dataloader'

const getCompanyTable = () => connection.table('company')

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id })
}

export function createCompanyLoader() {
  return new Dataloader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn('id', ids)
    return ids.map((id) => companies.find((company) => company.id === id))
  })
}

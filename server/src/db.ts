import { Client } from 'pg'

export const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Dashboard',
  password: '970107',
  port: 5432,
})

import { Request, Response, Router } from 'express'
const campaignRouter = Router()
import { client } from '../db'

campaignRouter.post('/create', async (req: Request, res: Response) => {
  const { segment, gender, billing, age, payment, date, day, product, limra } = req.body
  const row = (await client.query('INSERT INTO public.campaign(client_segment, gender, billing_frequency, age, payment_type, date_range, day, product, limra) \
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [ segment, gender, billing, age, payment, date, day, product, limra ])).rows
  res.json(row)
})

campaignRouter.post('/history', async (req: Request, res: Response) => {
  const { product, limra } = req.body
  const row = (await client.query('SELECT * FROM public.campaign WHERE product = $1 AND limra = $2', [product, limra])).rows
  res.json(row)
})

export default campaignRouter

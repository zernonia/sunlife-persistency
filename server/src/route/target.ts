import { Request, Response, Router } from 'express'
const targetRouter = Router()
import { client } from '../db'
import { groupBy } from '../utils/func'

targetRouter.post('/', async (req: Request, res: Response) => {
  const { product, limra, target } = req.body
  let row
  try {
    row = (await client.query('SELECT * FROM public.target WHERE product = $1 AND limra = $2', [ product, limra ])).rows
  } catch(err) {
    row = (await client.query('INSERT INTO public.target(product, limra, target) \
      VALUES ($1, $2, $3) RETURNING *', [ product, limra, target ])).rows
    }
  res.json(row)
})

targetRouter.put('/', async (req: Request, res: Response) => {
  const { product, limra, target } = req.body
  const row = (await client.query('UPDATE public.target SET target = $3 WHERE product = $1 AND limra = $2 RETURNING *', [product, limra, target])).rows
  res.json(row)
})

targetRouter.get('/', async (req: Request, res: Response) => {
  const row = (await client.query('SELECT * FROM public.target WHERE limra = 2021')).rows
  const groupByProduct = groupBy('product')
  const groupResult = groupByProduct(row)
  res.json(groupResult)
})

export default targetRouter

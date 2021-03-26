import { Router, Request, Response } from 'express'
import { client } from '../db'
import { Parser } from 'json2csv'
const dndRouter = Router()

dndRouter.post('/', async (req: Request, res: Response) => {
  const { list, product, limra, mob } = req.body
  const row = (await client.query('INSERT INTO public."generateLead"(file, priority, limra, product, mob) \
  VALUES ($1, $2, $3, $4, $5) RETURNING *', [`test${product}.csv`, list, limra, product, mob])).rows

  console.log(row);
  const opts = { row }
  
  const json2csv = new Parser();
  const csv = json2csv.parse(row);
  console.log(csv);
  
  res.header('Content-Type', 'text/csv');
  res.attachment('testing.csv');
  res.send(csv);
})

dndRouter.get('/', async (req: Request, res: Response) => {
  const row = (await client.query('SELECT * FROM public."generateLead"')).rows
  
  const json2csv = new Parser();
  const csv = json2csv.parse(row);

  res.header('Content-Type', 'text/csv');
  res.attachment('testing.csv');
  res.send(csv);
})

dndRouter.post('/action', async (req: Request, res: Response) => {
  const { product, limra } = req.body
  const row = (await client.query('SELECT * FROM public."generateLead" WHERE limra = $1 AND product = $2 ORDER BY created_at DESC', [limra, product])).rows
  res.json(row)
})

dndRouter.post('/old', async (req: Request, res: Response) => {
  const { product, limra, priority, mob } = req.body
  // const row = (await client.query('SELECT * FROM public."generateLead" WHERE limra = $1 AND product = $2 AND priority = $3 AND mob = $4', [limra, product, priority, mob])).rows
  const data = (await client.query('SELECT "policy_no", "Client_Segment", "Age_Score", "Gender_Score", "Billing_Score", "Payment_Score" FROM public."clientData" WHERE "LIMRA" = $1 AND "Prod_Name_Group" = $2 AND "Next_Collection_Term" = $3', [limra, product, mob])).rows
  const row = (await client.query('SELECT * FROM public."newData" WHERE "LIMRA" = $1 AND "Prod_Name_Group" = $2 AND "Next_Collection_Term" = $3', [limra, product, mob])).rows

  const scoring = priority.map((item: string, index: number) => {
    return {
      priority: item,
      score: 15 - (3* index)
    }
  })

  data.map((item: any, index: number) => {
    item.total_score = 0
    scoring.forEach((x: any) => {
      item.total_score += item[x.priority] * x.score 
    })
  })

  const result = row.map(a => ({...data.find(p => a.policy_no === p.policy_no), ...a}))
  result.sort((a: any,b: any) => {
    if(a.total_score > b.total_score) return -1
    if(a.total_score < b.total_score) return 1
    return 0
  })

  res.json({priority,scoring, data, row, result})
})

export default dndRouter
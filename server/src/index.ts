import express, { Request, Response } from 'express'
import cors from 'cors'
import { client } from './db'
import { types } from 'pg'
import dndRouter from './route/dnd'
import mainRouter from './route/main'

const PORT = 3000

client.connect()

types.setTypeParser(types.builtins.INT8, (value: string) => parseInt(value))
types.setTypeParser(1700, (value: string) => parseFloat(value))

const app = express()
app.use(express.json())
app.use(cors())

app.use('/main', mainRouter)

app.use('/dnd', dndRouter)

app.get('/filterRawDataAll', async (req: Request, res: Response) => {   
  const row = (await client.query(`SELECT * FROM public."newData" WHERE "Prod_Name_Group" = 'DMTM_OTH' AND "LIMRA" = '2021' GROUP BY mth_id ORDER BY mth_id DESC LIMIT 100 `)).rows
  row.map((a: any) => a.mth_id = Date.parse(a.mth_id))
  row.sort((a: any,b: any) => a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id )
  
  res.json(row)
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});

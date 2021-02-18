import express, { Request, Response } from 'express'
import cors from 'cors'
import Database, { Statement } from 'better-sqlite3'
import fs from 'fs'

const PORT = 3000
const db = new Database('./db/persistency.db')
const dataLocation = 'C:/Users/sians/OneDrive/Desktop/SL/sunlife-persistency/server/db/'

const app = express()
app.use(express.json())
app.use(cors())


function* toRows(stmt: Statement, params?: any[]) {
  
  yield stmt.columns().map(column => column.name);
  if(params){
    yield* stmt.raw().iterate(...params);
  } else {
    yield* stmt.raw().iterate();
  }
}

function writeToCSV(filename: string, stmt: Statement, params?: any[]) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename);
    for (const row of toRows(stmt, params)) {
      stream.write(row.join(',') + '\n');
    }
    stream.on('error', reject);
    stream.end(resolve);
  });
}

function processData(row: any[], MA: any[]) {
  const resObj = {}
  row.map((a: any) => a.mth_id = Date.parse(a.mth_id))
  row.sort((a: any,b: any) => a.mth_id - b.mth_id )

  const maxData: number[] = []

  if(row.length) {
    for(let i = 1; i <= 12; i++) {
      if(i == 1) {
        maxData.push(row[row.length - i][`sum_MOB_${i}`])
      } else {
        maxData.push(row[row.length - i][`sum_MOB_${i}`])
      }
    }
  }

  row.map((a: any) => {
    for(let i = 1; i <= 13; i++) {
      a[`MOB_${i}_perc`] = Math.round(a[`sum_MOB_${i}`] / a.total * 1000) / 10 
      if(a[`sum_MOB_${i}`] == 0) {
        const index = i - 1
        if(a[`sum_MOB_${index}`] == 0) {
          a[`MOB_${i}_predict`] = Math.round(a[`MOB_${index}_predict`] * MA[index] / 100 )  
        } else {
          a[`MOB_${i}_predict`] = Math.round(a[`sum_MOB_${index}`] * MA[index] / 100 )
        }
        a[`MOB_${i}_predict_perc`] = Math.round(a[`MOB_${i}_predict`] / a.total * 1000 ) / 10
      }
    }
  })

  return { row, maxData }
}

function multiply(obj: any, start: number, end: number) {
  let startTime = start
  let multiplier = 1
  while (startTime <= end) {
    multiplier *= obj[`target_MA_MOB_${ startTime }`]
    startTime++
  }
  return multiplier
}

function newProcessData(row: any[], MA: any[], single = false) {
  const collectedData: number[] = []
  row.forEach((item: any, index: number) => {
    if(index == 0){
      for(let i = 1; i <= 13; i++) {
        collectedData.push(item[`sum_MOB_${i}`])
      }
     } else {
      for(let i = 1; i <= 13; i++) {
        collectedData[i - 1] += item[`sum_MOB_${i}`]
      }
    }
  })
  const collectableDataArray: any[] = []
  if(single == true) {
    const indexInMA = MA.findIndex(x => x.Prod_Name_Group == row[0].Prod_Name_Group)
    MA = [MA[indexInMA]]
  }
  MA.forEach((ma: any) => {
    let collectableData: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0]
    row.forEach((item: any, index: number) => {
      let refMaxData: number = 0
      let refIndex: number = 0
      for(let i = 1; i <= 13; i++) {
        if(item[`sum_MOB_${i}`] == 0) {
          if(refMaxData == 0) {
            refMaxData = item[`sum_MOB_${i - 1}`] 
            refIndex = i
          }
          collectableData[i - 1] += (Math.round(refMaxData * multiply(ma, refIndex, i)))
        }
      }
    })
    collectableDataArray.push(collectableData)
  })

  if(single == true ) {
    let initialValue = Math.round((collectedData[collectedData.length - 1] + collectableDataArray[0][collectedData.length - 1]) / collectedData[0] * 1000 ) / 10
    return { LIMRA: initialValue }
  } else {
    return { collectedData, collectableDataArray }
  }
}

function calculateOverallLIMRA(row: any, MA: any[]) {
  let collectedData: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0]
  let collectableData: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0]

  Object.keys(row).forEach((item: any, index: number) => {
    row[item].forEach((subItem: any, index: number) => {
      let refMaxData: number = 0
      let refIndex: number = 0
      const maIndex = MA.findIndex(x => x.Prod_Name_Group == subItem.Prod_Name_Group)
      const ma = MA[maIndex]
      for(let i = 1; i <= 13; i++) {
        collectedData[i - 1] += subItem[`sum_MOB_${i}`]
        if(subItem[`sum_MOB_${i}`] == 0) {
          if(refMaxData == 0) {
            refMaxData = subItem[`sum_MOB_${i - 1}`] 
            refIndex = i
          }
          collectableData[i - 1] += (Math.round(refMaxData * multiply(ma, refIndex, i)))
        }
      }
    })
  })
  
  let initialValue = Math.round((collectedData[collectedData.length - 1] + collectableData[collectedData.length - 1]) / collectedData[0] * 1000 ) / 10
  return initialValue
}



app.get('/initial', (req: Request, res: Response) => {
  const row = db.prepare("SELECT * FROM Initial_DMTM_2021").all()

  // "SELECT mth_id, count(MOB_1) as total, count(payment_method='DEBITC' or null) as C , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
  // sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
  // sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13 \
  // FROM Persistency_Data GROUP BY mth_id ORDER BY mth_id DESC"


  const rowLastLIMRA = db.prepare(`SELECT mth_id, count(MOB_1) as total , sum(MOB_3) as sum_MOB_3, \
  sum(MOB_6) as sum_MOB_6, sum(MOB_9) as sum_MOB_9, sum(MOB_12) as sum_MOB_12 \
  FROM Persistency_Data \
  WHERE Prod_Name_Group IN ('DMTM_OTH') \
  AND Channel IN ('DMTM') \
  AND LIMRA IN (2020)`).all()

  const lastLIMRAMOB = {
    mob3: Math.round(rowLastLIMRA[0].sum_MOB_3 / rowLastLIMRA[0].total * 1000) / 10, 
    mob6: Math.round(rowLastLIMRA[0].sum_MOB_6 / rowLastLIMRA[0].total * 1000) / 10, 
    mob9: Math.round(rowLastLIMRA[0].sum_MOB_9 / rowLastLIMRA[0].total * 1000) / 10, 
    mob12: Math.round(rowLastLIMRA[0].sum_MOB_12 / rowLastLIMRA[0].total * 1000) / 10, 
  }
  const newDBMA = db.prepare("SELECT * FROM MA WHERE Prod_Name_Group = 'DMTM_OTH'").all()
  const MA = Object.values(newDBMA[0]).slice(1).map((item: any) => item*100)
  
  const processed = processData(row, MA)
  
  res.json({ row: processed.row , MA, maxData: processed.maxData, lastLIMRAMOB })
})

app.get('/new', (req: Request, res: Response) => {
  const row = db.prepare("SELECT mth_id, sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
    sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
    sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13, \
    count(MOB_1) as total , avg(MOB_1) as avg_MOB_1, avg(MOB_2) as avg_MOB_2, avg(MOB_3) as avg_MOB_3, avg(MOB_4) as avg_MOB_4, \
    avg(MOB_5) as avg_MOB_5, avg(MOB_6) as avg_MOB_6, avg(MOB_7) as avg_MOB_7, avg(MOB_8) as avg_MOB_8, \
    avg(MOB_9) as avg_MOB_9, avg(MOB_10) as avg_MOB_10, avg(MOB_11) as avg_MOB_11, avg(MOB_12) as avg_MOB_12, avg(MOB_13) as avg_MOB_13 , \
    avg(est_MOB_1) as est_MOB_1, avg(est_MOB_2) as est_MOB_2, avg(est_MOB_3) as est_MOB_3, avg(est_MOB_4) as est_MOB_4, avg(est_MOB_5) as est_MOB_5, avg(est_MOB_6) as est_MOB_6, \
    avg(est_MOB_7) as est_MOB_7, avg(est_MOB_8) as est_MOB_8, avg(est_MOB_9) as est_MOB_9, avg(est_MOB_10) as est_MOB_10, avg(est_MOB_11) as est_MOB_11, avg(est_MOB_12) as est_MOB_12, \
    avg(est_MOB_11) as est_MOB_11 \
    FROM newData \
    WHERE Prod_Name_Group = 'DMTM_OTH' \
    GROUP BY mth_id ORDER BY mth_id DESC").all()
    
    res.json({row})
  })

app.get('/ma', (req: Request, res: Response) => {
  const MA = db.prepare("SELECT * FROM newMA WHERE Prod_Name_Group = 'DMTM_OTH'").all()
  const row = db.prepare(" \
  SELECT mth_id, sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
    sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
    sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13, \
    count(MOB_1) as total \
    FROM newData \
    WHERE Prod_Name_Group = 'DMTM_OTH' \
    AND LIMRA = '2021' \
    GROUP BY mth_id ORDER BY mth_id DESC").all()

  row.map((a: any) => a.mth_id = Date.parse(a.mth_id))
  row.sort((a: any,b: any) => b.mth_id - a.mth_id )

  const processed = newProcessData(row, MA)
  res.json({MA, processed})
})

app.get('/productLIMRA', (req: Request, res: Response) => {
  const MA = db.prepare("SELECT * FROM newMA WHERE target = '0%'").all()
  const row = db.prepare("SELECT mth_id, Prod_Name_Group,  count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
  sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8,  \
  sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13  \
  FROM Persistency_Data \
  WHERE LIMRA = 2021 \
  GROUP BY mth_id, Prod_Name_Group \
  ORDER BY Prod_Name_Group, mth_id \
  ").all()

  row.map((a: any) => a.mth_id = Date.parse(a.mth_id))
  row.sort((a: any,b: any) => a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id )

  function groupBy(key: any) {
    return function group(array: any[]) {
      return array.reduce((acc: any, obj: any) => {
        const property = obj[key]
        acc[property] = acc[property] || []
        acc[property].push(obj)
        return acc
      }, {})
    }
  }

  const groupByProduct = groupBy("Prod_Name_Group")
  const groupResult = groupByProduct(row)

  const temp: any = {}
  Object.keys(groupResult).forEach((item: any) => {
    temp[item] = newProcessData(groupResult[item], MA, true).LIMRA
  })
  temp['Overall'] = calculateOverallLIMRA(groupResult, MA)
  res.json(temp)
})

app.post('/prepareData', async (req: Request, res: Response) => {
  const product = req.body
  const filename = 'persistency_' + product.toString() + '.csv'
  const filepath = dataLocation + filename
  let row
  if(product.length){
    row = db.prepare(`SELECT * FROM Persistency_Data WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')})`)
    writeToCSV(filepath, row, product).then( () => {
      res.json({filename})
    }).catch(e => res.status(500).send(e))
  } else {
    res.json({ filename: 'Persistency_Data.csv'})
  }
})

app.get('/downloadData/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename  
  const fileLocation = dataLocation + filename

  if(!fs.existsSync(fileLocation)){
    res.status(400).send({ filename: fileLocation, message: "No such file available"})
  }
  res.download(fileLocation)
})

app.post('/filter', (req: Request, res: Response) => {
  const { product, paymentMethod, staffDesignation, limra } = req.body

  const row = db.prepare(`SELECT mth_id, count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
  sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
  sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13 \
  FROM Persistency_Data \
  WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) \
  AND payment_method IN (${ paymentMethod.map(function(){ return '?' }).join(',')}) \
  AND Channel IN (${ staffDesignation.map(function(){ return '?' }).join(',')}) \
  AND LIMRA IN (${ limra.map(function(){ return '?' }).join(',')}) \
  GROUP BY mth_id \
  ORDER BY mth_id DESC`).all(product, paymentMethod, staffDesignation, limra)

  const lastLIMRA = [Number(limra[0]) - 1]

  const rowLastLIMRA = db.prepare(`SELECT mth_id, count(MOB_1) as total , sum(MOB_3) as sum_MOB_3, \
  sum(MOB_6) as sum_MOB_6, sum(MOB_9) as sum_MOB_9, sum(MOB_12) as sum_MOB_12 \
  FROM Persistency_Data \
  WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) \
  AND payment_method IN (${ paymentMethod.map(function(){ return '?' }).join(',')}) \
  AND Channel IN (${ staffDesignation.map(function(){ return '?' }).join(',')}) \
  AND LIMRA IN (${ limra.map(function(){ return '?' }).join(',')})`).all(product, paymentMethod, staffDesignation, lastLIMRA)

  const lastLIMRAMOB = {
    mob3: Math.round(rowLastLIMRA[0].sum_MOB_3 / rowLastLIMRA[0].total * 1000) / 10, 
    mob6: Math.round(rowLastLIMRA[0].sum_MOB_6 / rowLastLIMRA[0].total * 1000) / 10, 
    mob9: Math.round(rowLastLIMRA[0].sum_MOB_9 / rowLastLIMRA[0].total * 1000) / 10, 
    mob12: Math.round(rowLastLIMRA[0].sum_MOB_12 / rowLastLIMRA[0].total * 1000) / 10, 
  }

  const newDBMA = db.prepare(`SELECT * FROM MA WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) `).all(product)
  const MA = Object.values(newDBMA[0]).slice(1).map((item: any) => item*100)
  const processed = processData(row, MA)

  res.json({ row: processed.row , MA, maxData: processed.maxData, lastLIMRAMOB })
})

app.get('/filterRawDataAll', (req: Request, res: Response) => {   
  const row = db.prepare(`SELECT * FROM newData WHERE Prod_Name_Group = 'DMTM_OTH' AND LIMRA = '2021' GROUP BY mth_id ORDER BY mth_id DESC LIMIT 100 `).all()
  row.map((a: any) => a.mth_id = Date.parse(a.mth_id))
  row.sort((a: any,b: any) => a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id )
  
  res.json(row)
})

app.post('/filterRawData', (req: Request, res: Response) => {
  const { product, paymentMethod, staffDesignation, mob, limra } = req.body
  let row
  if(mob == 1){   
    row = db.prepare(`SELECT *
    FROM Persistency_Data \
    WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) \
    AND payment_method IN (${ paymentMethod.map(function(){ return '?' }).join(',')}) \
    AND Channel IN (${ staffDesignation.map(function(){ return '?' }).join(',')}) \
    AND LIMRA IN (${ limra.map(function(){ return '?' }).join(',')}) \
    AND status_cd = 'IF'
    `).all(product, paymentMethod, staffDesignation, limra)
  } else {
    row = db.prepare(`SELECT *
    FROM Persistency_Data \
    WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) \
    AND payment_method IN (${ paymentMethod.map(function(){ return '?' }).join(',')}) \
    AND Channel IN (${ staffDesignation.map(function(){ return '?' }).join(',')}) \
    AND LIMRA IN (${ limra.map(function(){ return '?' }).join(',')}) \
    AND MOB_${mob} = 0 \
    AND MOB_${mob - 1} != 0 \
    AND status_cd = 'IF'
    `).all(product, paymentMethod, staffDesignation, limra)
  }

  res.json(row)
})

app.post('/filterRawDataDownload', (req: Request, res: Response) => {
  const { product, paymentMethod, staffDesignation, mob, limra } = req.body

  const filename = 'raw_persistency_' + product.toString() + limra.toString() + '_MOB_' + mob.toString() + '.csv'
  const filepath = dataLocation + filename

  const row = db.prepare(`SELECT *
  FROM Persistency_Data \
  WHERE Prod_Name_Group IN (${ product.map(function(){ return '?' }).join(',')}) \
  AND payment_method IN (${ paymentMethod.map(function(){ return '?' }).join(',')}) \
  AND Channel IN (${ staffDesignation.map(function(){ return '?' }).join(',')}) \
  AND LIMRA IN (${ limra.map(function(){ return '?' }).join(',')}) \
  AND MOB_${mob} = 0 \
  AND MOB_${mob - 1} != 0 \
  AND status_cd = 'IF'
  `)
  
  writeToCSV(filepath, row, [product, paymentMethod, staffDesignation, limra]).then( () => {
    res.json({filename})
  }).catch(e => res.status(500).send(e))
}) 


app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});

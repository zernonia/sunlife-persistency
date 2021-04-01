import { Router, Request, Response } from 'express'
import { client } from '../db'
import { Parser } from 'json2csv'
import { groupBy } from '../utils/func'
const mainRouter = Router()

mainRouter.get('/')

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
  MA.forEach((ma: any, maIndex: number) => {
    let temp = {
      [maIndex]: Object.values(collectedData),
    }
    row.forEach((item: any, index: number) => {
      for(let i = 1; i <= 13; i++) {
        if(i == 1) {
          temp[maIndex][i - 1] = temp[maIndex][i - 1] * ma[`target_MA_MOB_${i}`]
        } else {
          temp[maIndex][i - 1] = temp[maIndex][i - 2] * ma[`target_MA_MOB_${i}`]
        }
      }
    })
    let tempMinusActual = {
      [maIndex]: temp[maIndex].map((a, ai) => a - collectedData[ai])
    }
    let tempReturnArray = []

    //// operate Kent Calculation
    let refIndex = 1
    // looping Column (MOB1 - MOB13)
    let prevCol: number[] = []
    for(let i = 0; i < 13; i++) {
      let sumPrevRef = 0
      if(i == 0) {
        for(let j = 0; j < row.length; j++) {
          prevCol.push(row[j][`sum_MOB_${i + 1}`])
        }
      } else {
        // sum up Previous column reference cell
        for(let k = 0; k < refIndex && k < row.length ; k++) {
          if(row[k][`sum_MOB_${i + 1}`] == 0) {
            sumPrevRef += prevCol[k]
          }
        }
        sumPrevRef == 0 ? '' : refIndex++

        for(let j = 0; j < row.length; j++) {
          if(row[j][`sum_MOB_${i + 1}`] == 0) {
            // perform MIN(CELL , CELL / TOTALCELL * Multiplier)
            let x = Math.min(prevCol[j], prevCol[j]/sumPrevRef * tempMinusActual[maIndex][i] )
            prevCol[j] = x
          } else {
            prevCol[j] = row[j][`sum_MOB_${i + 1}`]
          }
        }
      }
      tempReturnArray.push(prevCol.reduce((a, b) => a + b , 0))
    }  
    collectableDataArray.push(tempReturnArray)
  })

  return { collectedData, collectableDataArray }
  
}

function calculateOverallLIMRA(row: any, target: any) {
  let total: number = 0
  let limra: number = 0
  let limraTarget: number = 0

  Object.keys(row).forEach((prod: any) => {
    total += row[prod]['collectableDataArray'][target[prod][0]['target']][0]
    limra += row[prod]['collectableDataArray'][0][12] 
    limraTarget += row[prod]['collectableDataArray'][target[prod][0]['target']][12]
  })

  return {
    actual: limra / total * 100,
    target: limraTarget / total * 100
  }
}

const querySum = `SELECT mth_id, "Prod_Name_Group",  count("MOB_1") as total , sum("MOB_1") as "sum_MOB_1", sum("MOB_2") as "sum_MOB_2", sum("MOB_3") as "sum_MOB_3", sum("MOB_4") as "sum_MOB_4", \
  sum("MOB_5") as "sum_MOB_5", sum("MOB_6") as "sum_MOB_6", sum("MOB_7") as "sum_MOB_7", sum("MOB_8") as "sum_MOB_8",  \
  sum("MOB_9") as "sum_MOB_9", sum("MOB_10") as "sum_MOB_10", sum("MOB_11") as "sum_MOB_11", sum("MOB_12") as "sum_MOB_12", sum("MOB_13") as "sum_MOB_13", \
  sum("FYAP") as "sum_AFYP"
  `

mainRouter.get('/maAll/:limra', async (req: Request, res: Response) => {
  const { limra } = req.params
  const MA = (await client.query('SELECT * FROM public."newMA"')).rows
  const target = (await client.query('SELECT * FROM public.target')).rows
  const row = (await client.query(`${querySum} \
  FROM public."newData" \
  WHERE "LIMRA" = $1 \
  GROUP BY mth_id, "Prod_Name_Group" \
  ORDER BY "Prod_Name_Group", mth_id DESC `, [limra])).rows

  const groupByProduct = groupBy("Prod_Name_Group")
  const groupResult = groupByProduct(row)
  const groupMAResult = groupByProduct(MA)

  const temp: any = {}
  Object.keys(groupResult).forEach((item: any) => {
    temp[item] = newProcessData(groupResult[item], groupMAResult[item])
  })

  const groupByProduct2 = groupBy('product')
  temp['Overall'] = calculateOverallLIMRA(temp, groupByProduct2(target))

  
  res.json(temp)
})

mainRouter.get('/ma', async (req: Request, res: Response) => {
  const MA = (await client.query(`SELECT * FROM public."newMA" WHERE "Prod_Name_Group" = 'DMTM_OTH'`)).rows
  const row = (await client.query(` ${querySum} \
  FROM public."newData" \
  WHERE "LIMRA" = 2021 AND "Prod_Name_Group" = 'DMTM_OTH' \
  GROUP BY mth_id, "Prod_Name_Group" \
  ORDER BY "Prod_Name_Group", mth_id DESC `)).rows

  const groupByProduct = groupBy("Prod_Name_Group")
  const groupResult = groupByProduct(row)
  const groupMAResult = groupByProduct(MA)

  const temp: any = {}
  Object.keys(groupResult).forEach((item: any) => {
    temp[item] = newProcessData(groupResult[item], groupMAResult[item])
  })
  res.json(temp[Object.keys(groupResult)[0]])
})

mainRouter.post('/ma', async (req: Request, res: Response) => {
  const { product, limra } = req.body

  const MA = (await client.query('SELECT * FROM public."newMA" WHERE "Prod_Name_Group" = $1', [product])).rows
  const row = (await client.query(`${querySum} \
  FROM public."newData" \
  WHERE "LIMRA" = $1 AND "Prod_Name_Group" = $2 \
  GROUP BY mth_id, "Prod_Name_Group" \
  ORDER BY "Prod_Name_Group", mth_id DESC `,[limra, product])).rows

  const groupByProduct = groupBy("Prod_Name_Group")
  const groupResult = groupByProduct(row)
  const groupMAResult = groupByProduct(MA)

  const temp: any = {}
  Object.keys(groupResult).forEach((item: any) => {
    temp[item] = newProcessData(groupResult[item], groupMAResult[item])
  })

  res.json(temp[Object.keys(groupResult)[0]])
})

export default mainRouter
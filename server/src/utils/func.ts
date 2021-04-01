import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserToken } from '../utils/interface'

export function groupBy(key: any) {
  return function group(array: any[]) {
    return array.reduce((acc: any, obj: any) => {
      const property = obj[key]
      acc[property] = acc[property] || []
      acc[property].push(obj)
      return acc
    }, {})
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // const cookie = req.cookies.jwt

  // jwt.verify(cookie, 'dashboard', (err: any, unsigned: any) => {
  //   if(err) {
  //     res.sendStatus(403)
  //   } else if(unsigned) {
  //     const data = unsigned as UserToken
  //     req.user = data.username
  //     next()
  //   }
  // })
  next()
}
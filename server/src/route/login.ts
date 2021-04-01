import { Request, Response, Router, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { client } from '../db'
import { UserToken } from '../utils/interface'

const loginRouter = Router()

loginRouter.post('/', async (req: Request, res: Response) => {
  // login using AD
  const { username } = req.body
  const data: UserToken = {
    username,
    displayName: ''
  } 

  const token = jwt.sign(data, 'dashboard')

  res.cookie('jwt', token, {
    maxAge: 24 * 60 * 60  * 1000
  })
  res.json({
    authentication: true
  })
})

export default loginRouter

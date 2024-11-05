import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'

export function authMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    try {
      jwt.verify(token, process.env.JWT_SECRET!)
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }
}

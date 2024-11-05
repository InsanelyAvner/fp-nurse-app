import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    res.status(200).json({ message: 'Token is valid', userId: decoded.userId })
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

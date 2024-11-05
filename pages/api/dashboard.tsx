import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware } from '../../middleware/authMiddleware'

async function secureHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: ':3' })
}

export default authMiddleware(secureHandler)

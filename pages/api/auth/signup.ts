import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const { name, email, password } = req.body

    try {
        // TODO: Sign up and stuff


        res.status(200).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { SignJWT } from 'jose';
import cookie from 'cookie'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' })
	}

	const { email, password, rememberMe } = req.body

	try {
		const user = {
			id: 1,
			email: email,
			name: "Test"
		}

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}

		// const isMatch = await bcrypt.compare(password, user.password)
		// if (!isMatch) {
		//   return res.status(401).json({ error: 'Invalid email or password' })
		// }
		
		const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

		const token = await new SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? '365d' : '1h') 
        .sign(secret);

		res.setHeader(
			'Set-Cookie',
			cookie.serialize('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 3600,
				path: '/',
			})
		)

		res.status(200).json({ message: 'Login Successful' })
	} catch (error) {
		console.error('Login error:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

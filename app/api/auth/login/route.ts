import { SignJWT } from 'jose';
import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  try {
    const user = {
      id: 1,
      email: email,
      name: 'Test',
    };

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Uncomment and adjust the following if password verification is needed
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    // }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ user })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? '365d' : '1h')
      .sign(secret);

    // Create a response and set the cookie
    const response = NextResponse.json({ message: 'Login Successful' }, { status: 200 });

    response.headers.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 2147483647 : 3600,
        path: '/',
      })
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

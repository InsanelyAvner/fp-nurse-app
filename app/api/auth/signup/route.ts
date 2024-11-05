import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    try {
        // TODO: Add signup logic here

        return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

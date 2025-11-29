import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const ADMIN_USER = 'admin';
// password = "1234" (hashed only once at runtime)
const ADMIN_PASS_HASH = await bcrypt.hash('1234', 10);

export async function POST(req) {
  const { username, password } = await req.json();

  if (username === ADMIN_USER && (await bcrypt.compare(password, ADMIN_PASS_HASH))) {
    const res = NextResponse.json({ success: true });
    res.cookies.set('auth_token', 'your-secret-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return res;
  }

  return NextResponse.json({ error: 'Invalid Username or Password' }, { status: 401 });
}

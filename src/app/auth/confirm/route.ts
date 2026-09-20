import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function GET(request: NextRequest) {
  const db = await createClient();
  const params = request.nextUrl.searchParams;
  const token_hash = params.get('token_hash'),
    code = params.get('code');
  let ok = false;
  if (token_hash) {
    const { error } = await db.auth.verifyOtp({ token_hash, type: 'email' });
    ok = !error;
  } else if (code) {
    const { error } = await db.auth.exchangeCodeForSession(code);
    ok = !error;
  }
  return NextResponse.redirect(
    new URL(
      ok ? '/panel' : '/giris?message=Doğrulama%20bağlantısı%20geçersiz%20veya%20süresi%20dolmuş',
      request.url,
    ),
  );
}

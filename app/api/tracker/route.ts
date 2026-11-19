import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  return NextResponse.json({
    ok: true,
    message: 'Habitora tracker API ready',
    supabaseConfigured,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === 'string' && body.name.trim() ? body.name.trim() : 'My Habit Tracker';
    const durationDays = Math.max(1, Math.min(365, Number(body?.durationDays) || 30));
    const startDate =
      typeof body?.startDate === 'string' && body.startDate
        ? body.startDate
        : new Date().toISOString().split('T')[0];
    const habits = Array.isArray(body?.habits) ? body.habits : [];

    return NextResponse.json({
      ok: true,
      tracker: {
        name,
        durationDays,
        startDate,
        habitsCount: habits.length,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid tracker payload' }, { status: 400 });
  }
}

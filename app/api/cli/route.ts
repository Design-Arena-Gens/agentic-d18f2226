import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { command, files } = await req.json();
  const [name, ...rest] = String(command ?? '').trim().split(/\s+/);
  switch (name) {
    case 'echo':
      return NextResponse.json({ output: rest.join(' ') });
    default:
      return NextResponse.json({ output: 'Unknown command' });
  }
}

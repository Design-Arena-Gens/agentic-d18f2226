import { NextResponse } from 'next/server';
import { availableProviders } from '@/lib/providers';

export async function GET() {
  return NextResponse.json(availableProviders());
}

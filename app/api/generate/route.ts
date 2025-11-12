import { NextResponse } from 'next/server';
import { callProvider } from '@/lib/providers';
import { buildSystemPrompt, mergeFiles } from '@/lib/codegen';
import { type GenerateRequest } from '@/lib/types';

export async function POST(req: Request) {
  const body = (await req.json()) as GenerateRequest;
  const system = buildSystemPrompt();
  const messages = [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: `Current files JSON keys: ${Object.keys(body.files).join(', ')}` },
    { role: 'user' as const, content: `Prompt: ${body.prompt}` },
  ];

  const resp = await callProvider({ provider: body.provider, model: body.model, messages });

  let parsed: any = {};
  try {
    parsed = JSON.parse(resp.text);
  } catch {
    // try to extract code block
    const match = resp.text.match(/```json[\s\S]*?```/);
    if (match) {
      const raw = match[0].replace(/```json|```/g, '');
      parsed = JSON.parse(raw);
    }
  }

  const files = mergeFiles(body.files, parsed);
  return NextResponse.json({ files });
}

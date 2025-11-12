import { type ProviderId, type ProviderRequest, type ProviderResponse } from './types';

function env(name: string): string | undefined {
  return process.env[name];
}

async function handleOpenAI(req: ProviderRequest): Promise<ProviderResponse> {
  const key = env('OPENAI_API_KEY');
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: req.model,
      messages: req.messages,
      temperature: 0.2,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content ?? '';
  return { text };
}

async function handleAnthropic(req: ProviderRequest): Promise<ProviderResponse> {
  const key = env('ANTHROPIC_API_KEY');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': String(key),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: 2048,
      messages: req.messages,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  const text = j.content?.[0]?.text ?? '';
  return { text };
}

async function handleGemini(req: ProviderRequest): Promise<ProviderResponse> {
  const key = env('GOOGLE_API_KEY');
  const model = req.model || 'gemini-1.5-flash';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: req.messages.map(m => `${m.role}: ${m.content}`).join('\n') }] }],
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  const text = j.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
  return { text };
}

async function handleOpenRouter(req: ProviderRequest): Promise<ProviderResponse> {
  const key = env('OPENROUTER_API_KEY');
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ model: req.model, messages: req.messages }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content ?? '';
  return { text };
}

async function handleDeepSeek(req: ProviderRequest): Promise<ProviderResponse> {
  const key = env('DEEPSEEK_API_KEY');
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: req.model || 'deepseek-chat', messages: req.messages }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  const text = j.choices?.[0]?.message?.content ?? '';
  return { text };
}

export async function callProvider(req: ProviderRequest): Promise<ProviderResponse> {
  const id: ProviderId = req.provider;
  switch (id) {
    case 'openai': return handleOpenAI(req);
    case 'anthropic': return handleAnthropic(req);
    case 'gemini': return handleGemini(req);
    case 'openrouter': return handleOpenRouter(req);
    case 'deepseek': return handleDeepSeek(req);
    default: throw new Error('Unknown provider');
  }
}

export function availableProviders() {
  const out: { id: ProviderId; name: string; models: string[] }[] = [];
  if (env('OPENAI_API_KEY')) out.push({ id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'o4-mini', 'gpt-4o'] });
  if (env('ANTHROPIC_API_KEY')) out.push({ id: 'anthropic', name: 'Anthropic', models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'] });
  if (env('GOOGLE_API_KEY')) out.push({ id: 'gemini', name: 'Google Gemini', models: ['gemini-1.5-flash', 'gemini-1.5-pro'] });
  if (env('OPENROUTER_API_KEY')) out.push({ id: 'openrouter', name: 'OpenRouter', models: ['anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.1-70b-instruct'] });
  if (env('DEEPSEEK_API_KEY')) out.push({ id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] });
  // Ensure at least OpenAI with no key -> disabled but visible fallback
  if (out.length === 0) {
    out.push({ id: 'openai', name: 'OpenAI (no key set)', models: ['gpt-4o-mini'] });
  }
  return out;
}

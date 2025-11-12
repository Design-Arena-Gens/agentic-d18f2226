import { type GenerateRequest } from './types';

// Simple parser: expect model to return JSON with { files: { path: { content } } }
// Also support Markdown code fences with file paths in comments like // path: /src/App.jsx

export function buildSystemPrompt(): string {
  return (
`You are a code generation assistant for a browser-based editor with a virtual filesystem.
Return ONLY JSON of the form:\n{ "files": { "/path": { "content": "..." } } }\n- Do not include explanations.\n- Overwrite files fully.\n- Keep React app runnable in Vite-style structure with /index.html, /src/main.jsx, /src/App.jsx.\n`);
}

export function mergeFiles(current: GenerateRequest['files'], result: any): Record<string, { path: string; content: string | null; isBinary: boolean }> {
  const out = { ...current };
  const files = result?.files ?? {};
  for (const [path, spec] of Object.entries<any>(files)) {
    out[path] = { path, content: String(spec.content ?? ''), isBinary: false };
  }
  return out;
}

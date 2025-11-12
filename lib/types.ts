export type ProviderId = 'openai' | 'anthropic' | 'gemini' | 'openrouter' | 'deepseek';
export type ProviderRequest = { provider: ProviderId; model: string; messages: { role: 'system' | 'user' | 'assistant'; content: string }[] };
export type ProviderResponse = { text: string };

export type GenerateRequest = {
  provider: ProviderId;
  model: string;
  prompt: string;
  files: Record<string, { path: string; content: string | null; isBinary: boolean }>;
};

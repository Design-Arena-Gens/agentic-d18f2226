"use client";

import { useEffect, useState } from "react";

type ProviderInfo = { id: string; name: string; models: string[] };

export default function ProviderSelector({ value, model, onChange, onModelChange }: { value: string; model: string; onChange: (id: string) => void; onModelChange: (m: string) => void; }) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    fetch("/api/providers").then(r => r.json()).then(setProviders).catch(() => setProviders([]));
  }, []);

  useEffect(() => {
    const p = providers.find(p => p.id === value);
    if (p && !p.models.includes(model)) onModelChange(p.models[0] ?? "");
  }, [value, providers]);

  return (
    <div className="flex items-center gap-2">
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {providers.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select className="input" value={model} onChange={(e) => onModelChange(e.target.value)}>
        {(providers.find(p => p.id === value)?.models ?? []).map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}

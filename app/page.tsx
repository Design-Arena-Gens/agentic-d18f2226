"use client";

import { useEffect, useMemo, useState } from "react";
import ProviderSelector from "@/components/ProviderSelector";
import Terminal from "@/components/Terminal";
import FileTree from "@/components/FileTree";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { type VFile, createDefaultReactApp, fileMapToSandpack } from "@/lib/fs";

export default function HomePage() {
  const [files, setFiles] = useState<Record<string, VFile>>(() => createDefaultReactApp());
  const [activePath, setActivePath] = useState<string>("/src/App.jsx");
  const [provider, setProvider] = useState<string>("openai");
  const [model, setModel] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agentic-files");
    if (saved) setFiles(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("agentic-files", JSON.stringify(files));
  }, [files]);

  const sandpackFiles = useMemo(() => fileMapToSandpack(files), [files]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, prompt, files }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data?.files) setFiles(data.files);
    } catch (e: any) {
      alert(e?.message ?? "Generation error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-dvh grid grid-rows-[auto_1fr]">
      <header className="border-b border-border px-4 py-3 flex items-center gap-3">
        <h1 className="font-semibold">Agentic Code Creator</h1>
        <div className="ml-auto flex items-center gap-3">
          <ProviderSelector value={provider} model={model} onChange={setProvider} onModelChange={setModel} />
          <button className="button" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? "Generating..." : "Generate Code"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-3 p-3">
        <section className="col-span-3 card p-3 flex flex-col gap-3">
          <label className="text-sm text-muted">Prompt</label>
          <textarea className="input h-40" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the app or change you'd like..." />
          <Terminal files={files} setFiles={setFiles} onGenerate={handleGenerate} setPrompt={setPrompt} />
        </section>

        <section className="col-span-4 card overflow-hidden grid grid-cols-[240px_1fr]">
          <FileTree files={files} setFiles={setFiles} active={activePath} setActive={setActivePath} />
          <Editor files={files} setFiles={setFiles} active={activePath} />
        </section>

        <section className="col-span-5 card overflow-hidden">
          <Preview files={sandpackFiles} />
        </section>
      </div>
    </main>
  );
}

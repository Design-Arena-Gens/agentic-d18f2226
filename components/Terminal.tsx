"use client";

import { type VFile } from "@/lib/fs";
import { useRef, useState } from "react";

const helpText = `Commands:\n- help: Show help\n- ls: List files\n- cat <path>: Show file content\n- write <path> <content>: Write/overwrite file\n- mkdir <path>: Create folder\n- rm <path>: Delete file/folder\n- generate <prompt...>: Use LLM to generate/update code\n- provider [list|set <id> <model>]: Manage provider\n- preview react: Ensure React app scaffold exists\n- clear: Clear terminal`;

export default function Terminal({ files, setFiles, onGenerate, setPrompt }: { files: Record<string, VFile>; setFiles: (f: Record<string, VFile>) => void; onGenerate: () => Promise<void>; setPrompt: (p: string) => void; }) {
  const [lines, setLines] = useState<string[]>(["Type 'help' to get started."]);
  const [input, setInput] = useState("");
  const providerRef = useRef<{ id: string; model: string }>({ id: "openai", model: "gpt-4o-mini" });

  function append(s: string) { setLines(l => [...l, s]); }

  async function run(cmd: string) {
    append(`$ ${cmd}`);
    const [name, ...rest] = cmd.trim().split(/\s+/);
    try {
      switch (name) {
        case "help":
          append(helpText); break;
        case "clear":
          setLines([]); break;
        case "ls": {
          const keys = Object.keys(files).sort();
          append(keys.join("\n") || "<empty>");
          break;
        }
        case "cat": {
          const p = rest[0];
          if (!p || !files[p]) { append("Not found"); break; }
          append(String(files[p].content ?? "<dir>"));
          break;
        }
        case "write": {
          const p = rest[0];
          const content = rest.slice(1).join(" ");
          if (!p) { append("Path required"); break; }
          setFiles({ ...files, [p]: { path: p, content, isBinary: false } });
          append(`Wrote ${p}`);
          break;
        }
        case "mkdir": {
          const p = rest[0];
          if (!p) { append("Path required"); break; }
          setFiles({ ...files, [p]: { path: p, content: null, isBinary: false } });
          append(`Created ${p}`);
          break;
        }
        case "rm": {
          const p = rest[0];
          if (!p) { append("Path required"); break; }
          const next = { ...files };
          Object.keys(next).forEach(k => { if (k === p || k.startsWith(p + "/")) delete next[k]; });
          setFiles(next); append(`Removed ${p}`);
          break;
        }
        case "provider": {
          const sub = rest[0];
          if (sub === "list") {
            const res = await fetch("/api/providers");
            const data = await res.json();
            append(data.map((p: any) => `${p.id}: ${p.models.join(", ")}`).join("\n"));
          } else if (sub === "set") {
            providerRef.current = { id: rest[1], model: rest.slice(2).join(" ") };
            append(`Provider set to ${providerRef.current.id} ${providerRef.current.model}`);
          } else {
            append(`Current: ${providerRef.current.id} ${providerRef.current.model}`);
          }
          break;
        }
        case "generate": {
          const p = rest.join(" ");
          setPrompt(p);
          await onGenerate();
          append("Generation complete");
          break;
        }
        case "preview": {
          const type = rest[0];
          if (type === "react") {
            if (!files["/package.json"]) {
              setFiles({
                ...files,
                "/package.json": { path: "/package.json", isBinary: false, content: JSON.stringify({ name: "app", version: "1.0.0", scripts: { dev: "vite" } }, null, 2) },
                "/src/main.jsx": { path: "/src/main.jsx", isBinary: false, content: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nReactDOM.createRoot(document.getElementById('root')).render(<App />)` },
                "/src/App.jsx": { path: "/src/App.jsx", isBinary: false, content: `export default function App(){return <div style={{padding:20}}>Hello React</div>}` },
                "/index.html": { path: "/index.html", isBinary: false, content: `<!doctype html><html><body><div id='root'></div><script type='module' src='/src/main.jsx'></script></body></html>` },
              });
            }
            append("React preview scaffold ensured");
          } else {
            append("Usage: preview react");
          }
          break;
        }
        default:
          append("Unknown command. Try 'help'.");
      }
    } catch (e: any) {
      append(`Error: ${e?.message ?? e}`);
    }
  }

  return (
    <div className="card flex flex-col h-[320px] overflow-hidden">
      <div className="flex-1 overflow-auto p-2 font-mono text-sm whitespace-pre-wrap">{lines.join("\n")}</div>
      <form className="border-t border-border flex" onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}>
        <input className="flex-1 p-2 bg-transparent outline-none" value={input} onChange={(e) => setInput(e.target.value)} placeholder="$ command" />
        <button className="button m-2" type="submit">Run</button>
      </form>
    </div>
  );
}

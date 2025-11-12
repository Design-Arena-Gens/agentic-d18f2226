export type VFile = { path: string; content: string | null; isBinary: boolean };

export function isDirectory(f: VFile) {
  return f.content === null;
}

export function ensurePath(p: string) {
  if (!p.startsWith("/")) return "/" + p;
  return p;
}

export function toDisplayName(p: string) {
  return p.replace(/^\//, "");
}

export function createDefaultReactApp(): Record<string, VFile> {
  return {
    "/package.json": { path: "/package.json", isBinary: false, content: JSON.stringify({ name: "react-app", version: "1.0.0", private: true, dependencies: { react: "18.2.0", "react-dom": "18.2.0" } }, null, 2) },
    "/index.html": { path: "/index.html", isBinary: false, content: "<!doctype html><html><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>" },
    "/src/main.jsx": { path: "/src/main.jsx", isBinary: false, content: "import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\ncreateRoot(document.getElementById('root')).render(<App />)" },
    "/src/App.jsx": { path: "/src/App.jsx", isBinary: false, content: "export default function App(){return <div style={{padding:20}}>Click Generate to build the app.</div>}" },
  };
}

export function fileMapToSandpack(files: Record<string, VFile>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(files)) {
    if (v.content !== null && !v.isBinary) out[k] = v.content;
  }
  return out;
}

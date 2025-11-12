"use client";

import { type VFile, isDirectory, ensurePath, toDisplayName } from "@/lib/fs";

export default function FileTree({ files, setFiles, active, setActive }: { files: Record<string, VFile>; setFiles: (f: Record<string, VFile>) => void; active: string; setActive: (p: string) => void; }) {
  const paths = Object.keys(files).sort();
  function addFile() {
    const name = prompt("New file path (e.g. /src/New.jsx)");
    if (!name) return;
    const p = ensurePath(name);
    setFiles({ ...files, [p]: { path: p, content: "", isBinary: false } });
    setActive(p);
  }
  function addDir() {
    const name = prompt("New directory path (e.g. /src/components)");
    if (!name) return;
    const p = ensurePath(name);
    setFiles({ ...files, [p]: { path: p, content: null, isBinary: false } });
  }
  function remove(path: string) {
    if (!confirm(`Delete ${path}?`)) return;
    const next = { ...files };
    const toDelete = paths.filter(pp => pp === path || pp.startsWith(path + "/"));
    toDelete.forEach(pp => delete next[pp]);
    setFiles(next);
  }
  return (
    <div className="border-r border-border p-2 flex flex-col gap-2 min-w-[200px]">
      <div className="flex gap-2">
        <button className="button" onClick={addFile}>+ File</button>
        <button className="button" onClick={addDir}>+ Folder</button>
      </div>
      <div className="text-sm text-muted">Click a React target app to enable preview.</div>
      <div className="text-xs opacity-70">Preview auto-activates for React app files.</div>
      <ul className="text-sm mt-2 space-y-1 overflow-auto">
        {paths.map((p) => (
          <li key={p} className={`px-2 py-1 rounded flex items-center justify-between ${active === p ? 'bg-border/40' : ''}`}>
            <button className="text-left truncate" onClick={() => !isDirectory(files[p]) && setActive(p)}>
              {toDisplayName(p)}
            </button>
            <button className="text-red-300 text-xs" onClick={() => remove(p)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

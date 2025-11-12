"use client";

import { type VFile, isDirectory } from "@/lib/fs";

export default function Editor({ files, setFiles, active }: { files: Record<string, VFile>; setFiles: (f: Record<string, VFile>) => void; active: string; }) {
  const file = files[active];
  if (!file || isDirectory(file)) return <div className="p-3">Select a file to edit.</div>;
  return (
    <textarea
      className="w-full h-full p-3 bg-transparent outline-none"
      value={file.content ?? ""}
      onChange={(e) => setFiles({ ...files, [active]: { ...file, content: e.target.value } })}
      spellCheck={false}
    />
  );
}

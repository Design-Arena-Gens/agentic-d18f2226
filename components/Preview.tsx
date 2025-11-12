"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

export default function Preview({ files }: { files: Record<string, string> }) {
  return (
    <Sandpack
      template="react"
      theme="dark"
      options={{ layout: "preview", externalResources: [], recompileMode: "delayed" }}
      files={files}
    />
  );
}

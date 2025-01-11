import { Editor } from '@monaco-editor/react';
import { GeneratedCode } from '../types';

interface CodeEditorProps {
  code: GeneratedCode | null;
}

export function CodeEditor({ code }: CodeEditorProps) {
  if (!code) {
    return (
      <div className="h-[500px] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Generated code will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={code.language}
        value={code.content}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: true,
        }}
      />
    </div>
  );
}
import { FileStructure } from '../types';
import { FileCode } from 'lucide-react';

interface FileExplorerProps {
  files: FileStructure[];
  onFileSelect: (fileName: string) => void;
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <button
          key={file.name}
          onClick={() => onFileSelect(file.name)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${file.isSelected
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700/50'
            }`}
        >
          <FileCode className="w-4 h-4 flex-shrink-0" />
          <span className="truncate text-sm">{file.name}</span>
        </button>
      ))}
    </div>
  );
}
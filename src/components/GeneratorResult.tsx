import React, { useState, useEffect } from 'react';
import { ArrowLeft, Code2, Eye, Loader2, Wand2 } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { FileExplorer } from './FileExplorer';
import { FileStructure } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAEqPymGMYWxjc3M_Z0fQtqigOvoQaOiEQ');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface GeneratorResultProps {
  prompt: string;
  onBack: () => void;
}

export function GeneratorResult({ prompt, onBack }: GeneratorResultProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileStructure[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileSelect = (fileName: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file => ({
        ...file,
        isSelected: file.name === fileName,
      }))
    );
  };

  const parseCodeBlocks = (text: string): FileStructure[] => {
    const fileRegex = /```(\w+)\s*(?:\n|\r\n)([\s\S]*?)```/g;
    const files: FileStructure[] = [];
    let match;

    while ((match = fileRegex.exec(text)) !== null) {
      const [, language, content] = match;
      const fileName =
        language === 'html' ? 'index.html' :
          language === 'css' ? 'styles.css' :
            language === 'javascript' ? 'script.js' :
              `file.${language}`;

      files.push({
        name: fileName,
        content: content.trim(),
        language,
        isSelected: files.length === 0,
      });
    }

    return files.length > 0 ? files : [{
      name: 'index.html',
      content: text,
      language: 'html',
      isSelected: true,
    }];
  };

  const generateCode = async (promptText: string, isUpdate = false) => {
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const basePrompt = isUpdate
        ? `Update the existing website with the following changes (keep existing code and only modify what's necessary):
${promptText}

Current files:
${files.map(f => `${f.name}:
\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n')}`
        : `Create a website with the following requirements:
${promptText}

Important: Use only HTML, CSS, and JavaScript (no frameworks or libraries).
Provide the code in separate blocks for HTML, CSS, and JavaScript.`;

      const result = await model.generateContent(basePrompt);
      const text = await result.response.text();

      const parsedFiles = parseCodeBlocks(text);
      setFiles(parsedFiles);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setNewPrompt('');
    }
  };

  useEffect(() => {
    generateCode(prompt);
  }, [prompt]);

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      generateCode(newPrompt, true);
    }
  };

  const selectedFile = files.find(f => f.isSelected)
    ? {
      fileName: files.find(f => f.isSelected)?.name || '',
      content: files.find(f => f.isSelected)?.content || '',
      language: files.find(f => f.isSelected)?.language || '',
    }
    : null;
  const getPreviewContent = () => {
    const htmlFile = files.find(f => f.name === 'index.html')?.content || '';
    const cssFile = files.find(f => f.name === 'styles.css')?.content || '';
    const jsFile = files.find(f => f.name === 'script.js')?.content || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssFile}</style>
        </head>
        <body>
          ${htmlFile}
          <script>${jsFile}</script>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-[1920px] mx-auto p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Generator</span>
          </button>
          <div className="flex items-center gap-2 text-gray-400">
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{isLoading ? 'Generating...' : 'Generation complete'}</span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Re-prompt form */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 space-y-6">
              <form onSubmit={handleRegenerate} className="pt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Update Website</h3>
                <div className="space-y-3">
                  <textarea
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Describe the changes you want to make..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !newPrompt.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-medium transition-colors"
                  >
                    <Wand2 className="w-4 h-4" />
                    {isGenerating ? 'Updating...' : 'Update Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Files - 25% */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4 text-white">Files</h2>
              <FileExplorer files={files} onFileSelect={handleFileSelect} />
            </div>
          </div>

          {/* Editor/Preview - 50% */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">
                  {showPreview ? 'Preview' : 'Code Editor'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${!showPreview
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${showPreview
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden ring-1 ring-gray-700">
                {showPreview ? (
                  <div className="h-[600px] bg-white">
                    <iframe
                      srcDoc={getPreviewContent()}
                      className="w-full h-full border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="h-[500px]">
                    <CodeEditor code={selectedFile} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

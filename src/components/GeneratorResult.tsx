import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Eye, Loader2, Wand2, Copy, Download, Check } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { FileExplorer } from './FileExplorer';
import { FileStructure } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import JSZip from 'jszip';

const genAI = new GoogleGenerativeAI('AIzaSyAEqPymGMYWxjc3M_Z0fQtqigOvoQaOiEQ');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export function GeneratorResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<FileStructure[]>(() => {
    const saved = localStorage.getItem(`files_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showPreview, setShowPreview] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  useEffect(() => {
    // Load prompt from localStorage
    const savedData = localStorage.getItem(`generator_${id}`);
    if (!savedData) {
      navigate('/');
      return;
    }
    const { prompt } = JSON.parse(savedData);
    setPrompt(prompt);
  }, [id, navigate]);

  const handleBack = () => {
    // Clear only this generation's data
    localStorage.removeItem(`generator_${id}`);
    localStorage.removeItem(`files_${id}`);
    navigate('/');
  };

  const handleFileSelect = (fileName: string) => {
    setFiles(prevFiles =>
      prevFiles.map(file => ({
        ...file,
        isSelected: file.name === fileName
      }))
    );
  };

  const parseCodeBlocks = (text: string) => {
    const fileRegex = /```(\w+)\s*(?:\n|\r\n)([\s\S]*?)```/g;
    const files: FileStructure[] = [];
    let match;

    while ((match = fileRegex.exec(text)) !== null) {
      const [, language, content] = match;
      const fileName = language === 'html' ? 'index.html' :
        language === 'css' ? 'style.css' :
          language === 'javascript' ? 'script.js' :
            `file.${language}`;

      files.push({
        name: fileName,
        content: content.trim(),
        language,
        isSelected: files.length === 0
      });
    }

    return files.length > 0 ? files : [{
      name: 'index.html',
      content: text,
      language: 'html',
      isSelected: true
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
${files.map(f => `${f.name}:\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n')}`
        : `Create a website with the following requirements:
${promptText}

Important: Use only HTML, CSS, and JavaScript (no frameworks or libraries).
Please provide the code in separate blocks for HTML, CSS, and JavaScript. Use markdown code blocks with language specifications.`;

      const result = await model.generateContent(basePrompt);
      const response = await result.response;
      const text = response.text();

      // Split into chunks and stream
      const chunkSize = 500;
      let accumulatedText = '';

      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        accumulatedText += chunk;

        const parsedFiles = parseCodeBlocks(accumulatedText);
        setFiles(parsedFiles);
        // Save to localStorage with ID
        localStorage.setItem(`files_${id}`, JSON.stringify(parsedFiles));

        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      setNewPrompt('');
    }
  };

  useEffect(() => {
    if (prompt && !files.length) {
      generateCode(prompt);
    }
  }, [prompt, files.length]);

  const handleRegenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      generateCode(newPrompt, true);
    }
  };

  const handleCopyCode = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(selectedFile?.name || null);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    // Add all files to the zip
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'website.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to create zip file:', err);
    }
  };

  const selectedFile = files.find(f => f.isSelected) || null;
  const generatedCode = selectedFile ? {
    fileName: selectedFile.name,
    content: selectedFile.content,
    language: selectedFile.language
  } : null;

  const getPreviewContent = () => {
    const htmlFile = files.find(f => f.name === 'index.html')?.content || '';
    const cssFile = files.find(f => f.name === 'style.css')?.content || '';
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
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-700" />
              <Code2 className="w-6 h-6 text-indigo-400" />
              <h1 className="text-xl font-semibold text-white">Generated Website</h1>
            </div>
            <div className="flex items-center gap-4">
              {files.length > 0 && (
                <button
                  onClick={handleDownloadZip}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download ZIP</span>
                </button>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{isLoading ? 'Generating...' : 'Ready'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-12 gap-6 max-w-[1920px] mx-auto">
          {/* Files - 25% */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ring-1 ring-gray-700/50 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-white mb-4">Files</h2>
                <FileExplorer files={files} onFileSelect={handleFileSelect} />
              </div>

              {/* Re-prompt form */}
              <form onSubmit={handleRegenerate} className="pt-6 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Update Website</h3>
                <div className="space-y-3">
                  <textarea
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Describe the changes you want to make..."
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !newPrompt.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
                  >
                    <Wand2 className="w-4 h-4" />
                    {isGenerating ? 'Updating...' : 'Update Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Editor/Preview - 75% */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 ring-1 ring-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-white">
                    {showPreview ? 'Preview' : 'Code Editor'}
                  </h2>
                  {selectedFile && !showPreview && (
                    <button
                      onClick={() => handleCopyCode(selectedFile.content)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                    >
                      {copiedFile === selectedFile.name ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {copiedFile === selectedFile.name ? 'Copied!' : 'Copy Code'}
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${!showPreview
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Code</span>
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${showPreview
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden ring-1 ring-gray-700">
                {showPreview ? (
                  <div className="h-[700px] bg-white">
                    <iframe
                      srcDoc={getPreviewContent()}
                      className="w-full h-full border-0"
                      title="Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="h-[700px]">
                    <CodeEditor code={generatedCode} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
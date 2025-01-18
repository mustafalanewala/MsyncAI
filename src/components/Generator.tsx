import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Code2 } from 'lucide-react';

export function Generator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = btoa(Date.now().toString()); // Create a unique ID
    // Save prompt to localStorage with ID
    localStorage.setItem(`generator_${id}`, JSON.stringify({
      prompt,
      timestamp: Date.now()
    }));
    navigate(`/generate/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">Website Generator</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Create Your Website</h2>
            <p className="text-gray-400 text-lg">
              Describe your website and we'll generate the code for you instantly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 ring-1 ring-gray-700/50">
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-300 mb-3">
                What kind of website do you want to create?
              </label>
              <textarea
                id="prompt"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a responsive landing page with a dark theme, navigation menu, and contact form"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 text-lg transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium text-lg text-white transition-colors shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              <Wand2 className="w-6 h-6" />
              Generate Website
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
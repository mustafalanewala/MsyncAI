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
      timestamp: Date.now(),
    }));
    navigate(`/generate/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-900 via-cyan-800 to-teal-700 text-gray-100">
      <header className="flex items-center justify-center bg-transparent py-4">
        <Code2 className="w-10 h-10 text-indigo-400 pr-2" />
        <h1 className="text-3xl font-bold text-white">MsyncAI</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-100/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Generate Your Dream Website</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Describe your idea, and MsyncAI will handle the rest.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-base font-semibold text-gray-200 mb-2">
                Website Description
              </label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Build a portfolio with a contact form and blog section."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-100 placeholder-gray-400 text-sm shadow-sm transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium text-sm text-white shadow-md"
            >
              <Wand2 className="w-5 h-5" />
              Generate Website
            </button>
          </form>
        </div>
      </main>

      <footer className="mt-8 py-4 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} MsyncAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

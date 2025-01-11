import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { GeneratorResult } from './GeneratorResult';

export function Generator() {
  const [prompt, setPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  if (showResult) {
    return <GeneratorResult prompt={prompt} onBack={() => setShowResult(false)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Create Your Website</h2>
        <p className="text-gray-400">
          Describe your website and we'll generate the HTML, CSS, and JavaScript code for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            What kind of website do you want to create?
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Create a responsive landing page with a dark theme, navigation menu, and contact form"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
        >
          <Wand2 className="w-5 h-5" />
          Generate Website
        </button>
      </form>
    </div>
  );
}
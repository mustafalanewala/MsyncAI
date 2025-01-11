import { Code2 } from 'lucide-react';
import { Generator } from './components/Generator';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold">Website Generator</h1>
            <p className="ml-4 text-gray-400">Create websites using HTML, CSS, and JavaScript</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Generator />
      </main>
    </div>
  );
}

export default App;
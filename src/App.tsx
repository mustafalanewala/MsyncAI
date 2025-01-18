import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Generator } from './components/Generator';
import { GeneratorResult } from './components/GeneratorResult';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/generate/:id" element={<GeneratorResult />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
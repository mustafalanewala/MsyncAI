import { Step } from '../types';
import { CheckCircle, Loader2 } from 'lucide-react';

interface StepsProps {
  steps: Step[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-gray-800 rounded-lg p-3 transition-colors hover:bg-gray-750"
        >
          {index === steps.length - 1 && step.title !== 'Error' ? (
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-medium text-white">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
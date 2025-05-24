
import { useState } from 'react';
import { Calculator } from '@/components/Calculator';
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [windowSize, setWindowSize] = useState(10);
  const [currentWindow, setCurrentWindow] = useState<number[]>([]);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Average Calculator Microservice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            REST API simulator for calculating averages with sliding window algorithm.
            Supports prime, fibonacci, even, and random number types.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <Calculator 
              windowSize={windowSize}
              onWindowSizeChange={setWindowSize}
              currentWindow={currentWindow}
              onWindowChange={setCurrentWindow}
              onResponse={setLastResponse}
              isLoading={isLoading}
              onLoadingChange={setIsLoading}
            />
            
            <ApiTestPanel />
          </div>

          <div>
            <ResponseDisplay 
              response={lastResponse}
              isLoading={isLoading}
              windowSize={windowSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

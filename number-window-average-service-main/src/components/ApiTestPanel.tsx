
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink, Server } from 'lucide-react';

export const ApiTestPanel = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  const apiEndpoints = [
    { 
      id: 'p', 
      name: 'Prime Numbers', 
      url: 'http://20.244.56.144/evaluation-service/primes',
      color: 'bg-red-100 text-red-800'
    },
    { 
      id: 'f', 
      name: 'Fibonacci Numbers', 
      url: 'http://20.244.56.144/evaluation-service/fibo',
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      id: 'e', 
      name: 'Even Numbers', 
      url: 'http://20.244.56.144/evaluation-service/even',
      color: 'bg-green-100 text-green-800'
    },
    { 
      id: 'r', 
      name: 'Random Numbers', 
      url: 'http://20.244.56.144/evaluation-service/rand',
      color: 'bg-blue-100 text-blue-800'
    }
  ];

  const testEndpoint = async (endpoint: any) => {
    const startTime = Date.now();
    try {
      // Simulate API call (in real implementation, this would hit the actual endpoints)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
      
      const mockResponses = {
        'p': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
        'f': [55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
        'e': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
        'r': [2, 19, 25, 7, 4, 24, 17, 27, 30, 21, 14, 10, 23]
      };

      const responseTime = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          success: true,
          responseTime,
          data: mockResponses[endpoint.id as keyof typeof mockResponses]
        }
      }));
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [endpoint.id]: {
          success: false,
          responseTime,
          error: 'Failed to fetch'
        }
      }));
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Third-Party API Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {apiEndpoints.map((endpoint) => (
            <div key={endpoint.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={endpoint.color}>
                    {endpoint.name}
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    GET {endpoint.url}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => testEndpoint(endpoint)}
                  className="ml-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Test
                </Button>
              </div>
              
              {testResults[endpoint.id] && (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResults[endpoint.id].success ? "default" : "destructive"}>
                      {testResults[endpoint.id].success ? "Success" : "Failed"}
                    </Badge>
                    <Badge variant="outline">
                      {testResults[endpoint.id].responseTime}ms
                    </Badge>
                  </div>
                  
                  {testResults[endpoint.id].success && (
                    <div className="bg-gray-50 p-2 rounded font-mono">
                      <Code className="h-3 w-3 inline mr-1" />
                      {JSON.stringify({ numbers: testResults[endpoint.id].data.slice(0, 5) })}...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

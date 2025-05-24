
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalculatorIcon, Settings, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { numberService } from '@/services/numberService';

interface CalculatorProps {
  windowSize: number;
  onWindowSizeChange: (size: number) => void;
  currentWindow: number[];
  onWindowChange: (window: number[]) => void;
  onResponse: (response: any) => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export const Calculator = ({ 
  windowSize, 
  onWindowSizeChange, 
  currentWindow, 
  onWindowChange,
  onResponse,
  isLoading,
  onLoadingChange 
}: CalculatorProps) => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const { toast } = useToast();

  const numberTypes = [
    { id: 'p', name: 'Prime Numbers', color: 'bg-red-100 text-red-800' },
    { id: 'f', name: 'Fibonacci Numbers', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'e', name: 'Even Numbers', color: 'bg-green-100 text-green-800' },
    { id: 'r', name: 'Random Numbers', color: 'bg-blue-100 text-blue-800' }
  ];

  const handleFetchNumbers = async () => {
    if (!selectedType) {
      toast({
        title: "Selection Required",
        description: "Please select a number type first.",
        variant: "destructive"
      });
      return;
    }

    onLoadingChange(true);
    const startTime = Date.now();

    try {
      const windowPrevState = [...currentWindow];
      const result = await numberService.fetchNumbers(selectedType, currentWindow, windowSize);
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      
      setResponseTime(timeTaken);
      onWindowChange(result.windowCurrState);
      
      const response = {
        windowPrevState,
        windowCurrState: result.windowCurrState,
        numbers: result.numbers,
        avg: result.avg,
        responseTime: timeTaken
      };
      
      onResponse(response);

      if (timeTaken > 500) {
        toast({
          title: "Warning: Slow Response",
          description: `Response took ${timeTaken}ms (exceeds 500ms limit)`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Numbers fetched in ${timeTaken}ms`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch numbers from the server",
        variant: "destructive"
      });
      onResponse(null);
    } finally {
      onLoadingChange(false);
    }
  };

  const calculateAverage = (numbers: number[]) => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-5 w-5" />
            Average Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="windowSize" className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4" />
                Window Size
              </Label>
              <Input
                id="windowSize"
                type="number"
                min="1"
                max="20"
                value={windowSize}
                onChange={(e) => onWindowSizeChange(parseInt(e.target.value) || 10)}
                className="text-center font-mono"
              />
            </div>
            <div>
              <Label className="block mb-2">Number Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {numberTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleFetchNumbers} 
            disabled={isLoading || !selectedType}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Fetching Numbers...' : 'Fetch Numbers'}
          </Button>

          {responseTime !== null && (
            <div className="text-center">
              <Badge variant={responseTime > 500 ? "destructive" : "default"}>
                Response Time: {responseTime}ms
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Current Window State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">
                Numbers in Window ({currentWindow.length}/{windowSize})
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {currentWindow.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {currentWindow.map((num, index) => (
                      <Badge key={index} variant="outline">
                        {num}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">No numbers yet</span>
                )}
              </div>
            </div>
            
            {currentWindow.length > 0 && (
              <div>
                <Label className="text-sm text-gray-600">Current Average</Label>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  {calculateAverage(currentWindow).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

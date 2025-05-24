
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Monitor, Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface ResponseDisplayProps {
  response: any;
  isLoading: boolean;
  windowSize: number;
}

export const ResponseDisplay = ({ response, isLoading, windowSize }: ResponseDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg h-fit">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            API Response
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Fetching numbers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className="border-0 shadow-lg h-fit">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            API Response
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 py-8">
            <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No API calls made yet</p>
            <p className="text-sm">Select a number type and click "Fetch Numbers"</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg h-fit">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          API Response
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Response Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Response Time</span>
          </div>
          <Badge variant={response.responseTime > 500 ? "destructive" : "default"}>
            {response.responseTime}ms
          </Badge>
        </div>

        <Separator />

        {/* Numbers from API */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Numbers from API</h4>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex flex-wrap gap-1">
              {response.numbers.map((num: number, index: number) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Window State Changes */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Window State Changes</h4>
          
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Previous State</div>
              <div className="bg-gray-50 p-3 rounded-lg min-h-[2.5rem] flex items-center">
                {response.windowPrevState.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {response.windowPrevState.map((num: number, index: number) => (
                      <Badge key={index} variant="secondary">
                        {num}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Empty</span>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">Current State</div>
              <div className="bg-green-50 p-3 rounded-lg min-h-[2.5rem] flex items-center">
                <div className="flex flex-wrap gap-1">
                  {response.windowCurrState.map((num: number, index: number) => (
                    <Badge key={index} variant="outline" className="bg-white border-green-300">
                      {num}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Calculation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Average</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {response.avg.toFixed(2)}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Calculated from {response.windowCurrState.length} numbers
          </div>
        </div>

        {/* JSON Response */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">JSON Response</h4>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono">
              {JSON.stringify({
                windowPrevState: response.windowPrevState,
                windowCurrState: response.windowCurrState,
                numbers: response.numbers,
                avg: parseFloat(response.avg.toFixed(2))
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

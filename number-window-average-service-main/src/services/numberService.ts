class NumberService {
  private apiUrls = {
    'p': 'http://20.244.56.144/evaluation-service/primes',
    'f': 'http://20.244.56.144/evaluation-service/fibo', 
    'e': 'http://20.244.56.144/evaluation-service/even',
    'r': 'http://20.244.56.144/evaluation-service/rand'
  };

  private mockResponses = {
    'p': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
    'f': [55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946],
    'e': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    'r': [2, 19, 25, 7, 4, 24, 17, 27, 30, 21, 14, 10, 23, 15, 31, 9, 33]
  };

  async fetchNumbers(type: string, currentWindow: number[], windowSize: number) {
    console.log(`Fetching ${type} numbers...`);
    console.log('Current window before fetch:', currentWindow);
    console.log('Window size limit:', windowSize);
    
    try {
      // Store the previous state before any changes
      const windowPrevState = [...currentWindow];
      
      // Simulate API call with timeout
      const numbers = await this.simulateApiCall(type);
      console.log('Numbers received from API:', numbers);
      
      // Filter unique numbers that aren't already in the window
      const uniqueNewNumbers = numbers.filter(num => !currentWindow.includes(num));
      console.log('Unique new numbers:', uniqueNewNumbers);
      
      // Create new window by combining current window with new unique numbers
      let newWindow = [...currentWindow, ...uniqueNewNumbers];
      
      // If window exceeds size limit, keep only the most recent numbers
      if (newWindow.length > windowSize) {
        newWindow = newWindow.slice(-windowSize);
      }
      
      console.log('New window state:', newWindow);
      console.log('Final window size:', newWindow.length, '/ max:', windowSize);
      
      // Calculate average
      const avg = newWindow.length > 0 
        ? newWindow.reduce((sum, num) => sum + num, 0) / newWindow.length 
        : 0;
      
      console.log('Calculated average:', avg);
      
      return {
        windowPrevState: windowPrevState,
        windowCurrState: newWindow,
        numbers: numbers, // All numbers received from API
        avg: avg
      };
    } catch (error) {
      console.error('Error fetching numbers:', error);
      throw new Error('Failed to fetch numbers from API');
    }
  }

  private async simulateApiCall(type: string): Promise<number[]> {
    // Simulate network delay (100-400ms)
    const delay = Math.random() * 300 + 100;
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout (> 500ms)'));
      }, 500);
      
      setTimeout(() => {
        clearTimeout(timeout);
        
        // Simulate occasional errors (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error('API Error'));
          return;
        }
        
        // Return a subset of mock data with some randomness
        const mockData = this.mockResponses[type as keyof typeof this.mockResponses];
        const shuffled = [...mockData].sort(() => Math.random() - 0.5);
        const count = Math.min(Math.floor(Math.random() * 8) + 3, shuffled.length);
        resolve(shuffled.slice(0, count));
      }, delay);
    });
  }

  // Method to test actual API endpoints (for real implementation)
  private async fetchFromRealApi(type: string): Promise<number[]> {
    const url = this.apiUrls[type as keyof typeof this.apiUrls];
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.numbers || [];
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout (> 500ms)');
      }
      throw error;
    }
  }
}

export const numberService = new NumberService();

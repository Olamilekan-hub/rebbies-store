'use client';

import { useState } from 'react';
import config from '@/lib/config';

export default function TestConnection() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      console.log('Testing connection to:', config.apiBaseUrl);
        // Test basic connectivity
      const response = await fetch(`${config.apiBaseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.text();
        setResult(`✅ Connection successful! Response: ${data}`);
      } else {
        setResult(`❌ Connection failed with status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testProductsEndpoint = async () => {
    setLoading(true);
    setResult('Testing products endpoint...');
    
    try {
      const response = await fetch(`${config.apiBaseUrl}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Products endpoint works! Found ${data.length || 0} products`);
      } else {
        setResult(`❌ Products endpoint failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setResult(`❌ Products endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          API Connection Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>API Base URL:</strong> {config.apiBaseUrl}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>NextAuth URL:</strong> {config.nextAuthUrl}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Endpoints
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Health Endpoint'}
            </button>
            
            <button
              onClick={testProductsEndpoint}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Products Endpoint'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Result
            </h2>
            <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto text-gray-800 dark:text-gray-200">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

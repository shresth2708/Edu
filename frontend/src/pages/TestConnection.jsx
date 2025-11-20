import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

const TestConnection = () => {
  const [healthStatus, setHealthStatus] = useState(null)
  const [testResults, setTestResults] = useState([])
  const { isAuthenticated, token } = useSelector((state) => state.auth)

  useEffect(() => {
    testBackendConnection()
  }, [])

  const testBackendConnection = async () => {
    const results = []
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'

    // Test 1: Health Check
    try {
      const response = await axios.get('http://localhost:5001/health')
      setHealthStatus(response.data)
      results.push({
        test: 'Health Check',
        status: 'success',
        data: response.data
      })
    } catch (error) {
      results.push({
        test: 'Health Check',
        status: 'failed',
        error: error.message
      })
    }

    // Test 2: Get Courses (Public)
    try {
      const response = await axios.get(`${API_URL}/courses`)
      results.push({
        test: 'Get Courses',
        status: 'success',
        data: response.data
      })
    } catch (error) {
      results.push({
        test: 'Get Courses',
        status: 'failed',
        error: error.message
      })
    }

    // Test 3: Get Current User (if authenticated)
    if (isAuthenticated && token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        results.push({
          test: 'Get Current User',
          status: 'success',
          data: response.data
        })
      } catch (error) {
        results.push({
          test: 'Get Current User',
          status: 'failed',
          error: error.message
        })
      }
    }

    setTestResults(results)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>

        {/* Health Status */}
        {healthStatus && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Server Health</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-800">
                  Status: {healthStatus.status}
                </span>
              </div>
              <pre className="text-sm bg-white p-3 rounded mt-2 overflow-auto">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">API Test Results</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                {result.data && (
                  <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
                {result.error && (
                  <p className="text-red-600 text-sm">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connection Info */}
        <div className="card mt-6">
          <h2 className="text-xl font-bold mb-4">Connection Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">API URL:</span>
              <span className="font-mono">
                {import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Authenticated:</span>
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>
            {token && (
              <div className="flex justify-between">
                <span className="text-gray-600">Token:</span>
                <span className="font-mono text-xs">{token.substring(0, 20)}...</span>
              </div>
            )}
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={testBackendConnection}
          className="btn-primary w-full mt-6"
        >
          Retry Connection Tests
        </button>
      </div>
    </div>
  )
}

export default TestConnection

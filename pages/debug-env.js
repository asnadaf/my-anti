export default function DebugEnvironment() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Public Environment Variables</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2"><strong>NEXT_PUBLIC_MONGODB_URI:</strong> {process.env.NEXT_PUBLIC_MONGODB_URI || 'Not set'}</p>
          <p className="mb-2"><strong>NEXT_PUBLIC_BASE_URL:</strong> {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}</p>
          <p className="mb-2"><strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'Not set'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Build Information</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2"><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'Not set'}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm text-gray-600">Note: Only NEXT_PUBLIC_* variables are shown on the client side.</p>
      </div>
    </div>
  );
} 
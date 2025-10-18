import Link from "next/link";

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Website is Working!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your Next.js app is deployed and running successfully.
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200">
              ✅ Frontend: Deployed successfully
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200">
              🔧 Next step: Test API connection
            </p>
          </div>
        </div>
        <div className="mt-8 space-x-4">
          <Link 
            href="/test-connection" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md inline-block"
          >
            Test API Connection
          </Link>
          <Link 
            href="/shop" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md inline-block"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

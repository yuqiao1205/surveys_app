import Link from 'next/link';

export default function SurveySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Thank You!
        </h1>
        
        <p className="text-gray-600 mb-2">
          Your response has been submitted successfully.
        </p>
        
        <p className="text-gray-500 text-sm mb-8">
          We appreciate you taking the time to complete this survey.
        </p>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
        >
          Back to Surveys
        </Link>
      </div>
    </div>
  );
}
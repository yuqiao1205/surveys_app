import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { getSurveys, hasUserResponded } from '@/lib/actions/surveys';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    // Landing page for non-authenticated users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header session={null} />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')"
            }}
          ></div>

          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                📋 Survey App
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Create, manage, and analyze surveys with ease. Share your voice and help shape the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-semibold text-lg shadow-lg border border-gray-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Survey App?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed for creators and respondents alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Creation</h3>
                <p className="text-gray-600">Create surveys in minutes with our intuitive interface.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Get instant insights with detailed charts and statistics.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { surveys, error } = await getSurveys();

  // Check response status for each survey
  const surveysWithStatus = await Promise.all(
    (surveys || []).map(async (survey: any) => {
      const { hasResponded } = await hasUserResponded(survey._id);
      return { ...survey, hasResponded };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Surveys</h1>
          <p className="text-gray-600">
            Complete surveys and share your valuable feedback
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {surveysWithStatus.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No surveys available</h3>
            <p className="text-gray-600">Check back later for new surveys</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveysWithStatus.map((survey: any) => (
              <div
                key={survey._id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 ${
                  survey.hasResponded ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {survey.title}
                  </h3>
                  {survey.hasResponded && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full ml-2">
                      ✓ Completed
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📝 {survey.questions.length} questions</span>
                  <span>{new Date(survey.createdAt).toLocaleDateString()}</span>
                </div>

                {survey.hasResponded ? (
                  <div className="bg-gray-100 text-gray-600 text-center py-3 rounded-lg font-medium">
                    Already Submitted
                  </div>
                ) : (
                  <Link
                    href={`/surveys/${survey._id}`}
                    className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
                  >
                    Take Survey
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

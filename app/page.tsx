import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { getSurveys, hasUserResponded } from '@/lib/actions/surveys';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
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

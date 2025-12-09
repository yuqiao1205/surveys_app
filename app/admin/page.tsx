import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { getSurveys } from '@/lib/actions/surveys';
import Link from 'next/link';
import DeleteSurveyButton from '@/components/DeleteSurveyButton';

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin') {
    redirect('/');
  }

  const { surveys, error } = await getSurveys();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage surveys and view results</p>
          </div>
          <Link
            href="/admin/surveys/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
          >
            + Create New Survey
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {surveys && surveys.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No surveys yet</h3>
            <p className="text-gray-600 mb-6">Create your first survey to get started</p>
            <Link
              href="/admin/surveys/create"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              Create Survey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {surveys?.map((survey: any) => (
              <div
                key={survey._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {survey.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{survey.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        📝 {survey.questions.length} questions
                      </span>
                      <span>
                        Created: {new Date(survey.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/surveys/${survey._id}/results`}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition font-medium"
                    >
                      📊 Results
                    </Link>
                    <Link
                      href={`/admin/surveys/${survey._id}/edit`}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium"
                    >
                      ✏️ Edit
                    </Link>
                    <DeleteSurveyButton surveyId={survey._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
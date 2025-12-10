import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSurveyResults } from '@/lib/actions/surveys';
import Link from 'next/link';
import ResultsChart from '@/components/ResultsChart';

export default async function SurveyResultsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const result = await getSurveyResults(id);

  if (result.error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {result.error}
          </div>
        </div>
      </div>
    );
  }

  const { survey, totalResponses, statistics } = result;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
              <p className="text-gray-600">{survey.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{totalResponses}</div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
          </div>

          {totalResponses === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-600">Share this survey to start collecting responses</p>
            </div>
          ) : (
            <div className="space-y-8">
              {statistics.map((stat: any, index: number) => (
                <div key={stat.questionId} className="border-t pt-8 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Question {index + 1}: {stat.question}
                  </h3>

                  {stat.type === 'text' ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-3">
                        {stat.responses.length} text responses
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                        {stat.responses.map((response: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-gray-700">{response.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        {stat.totalResponses} responses
                      </p>
                      <ResultsChart data={stat.answerCounts} />
                      
                      <div className="mt-4 space-y-2">
                        {Object.entries(stat.answerCounts).map(([answer, count]: [string, any]) => (
                          <div key={answer} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                            <span className="text-gray-700">{answer}</span>
                            <span className="font-semibold text-gray-900">
                              {count} ({Math.round((count / stat.totalResponses) * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Link
            href={`/admin/surveys/${id}/edit`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Edit Survey
          </Link>
          <Link
            href="/admin"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
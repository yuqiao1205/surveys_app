'use client';

import { useState, useEffect } from 'react';
import { getSurvey, hasUserResponded, submitResponse } from '@/lib/actions/surveys';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Answer } from '@/lib/types';

export default function SurveyPage() {
  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alreadyResponded, setAlreadyResponded] = useState(false);
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;

  useEffect(() => {
    loadSurvey();
  }, []);

  const loadSurvey = async () => {
    const [surveyResult, responseCheck] = await Promise.all([
      getSurvey(surveyId),
      hasUserResponded(surveyId),
    ]);

    if (surveyResult.error) {
      setError(surveyResult.error);
    } else if (surveyResult.survey) {
      setSurvey(surveyResult.survey);
    }

    if (responseCheck.hasResponded) {
      setAlreadyResponded(true);
    }

    setInitialLoading(false);
  };

  const handleSingleChoice = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleMultipleChoice = (questionId: string, value: string, checked: boolean) => {
    const currentAnswers = (answers[questionId] as string[]) || [];
    if (checked) {
      setAnswers({ ...answers, [questionId]: [...currentAnswers, value] });
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter((a) => a !== value),
      });
    }
  };

  const handleTextAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required questions
    const missingAnswers = survey.questions.filter(
      (q: any) => q.required && !answers[q.id]
    );

    if (missingAnswers.length > 0) {
      setError('Please answer all required questions');
      setLoading(false);
      return;
    }

    // Format answers
    const formattedAnswers: Answer[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
      })
    );

    const result = await submitResponse(surveyId, formattedAnswers);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push('/surveys/success');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading survey...</div>
      </div>
    );
  }

  if (alreadyResponded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Completed</h2>
          <p className="text-gray-600 mb-6">You have already submitted a response to this survey</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            Back to Surveys
          </Link>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Survey not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Surveys
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
            <p className="text-gray-600">{survey.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              {survey.questions.length} questions • Required fields marked with *
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {survey.questions.map((question: any, index: number) => (
              <div key={question.id} className="pb-8 border-b last:border-b-0">
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {question.type === 'single' && (
                  <div className="space-y-3">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleSingleChoice(question.id, e.target.value)}
                          className="w-5 h-5 text-blue-600"
                          required={question.required}
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'multiple' && (
                  <div className="space-y-3">
                    {question.options.map((option: string, optionIndex: number) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={((answers[question.id] as string[]) || []).includes(option)}
                          onChange={(e) =>
                            handleMultipleChoice(question.id, e.target.value, e.target.checked)
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'text' && (
                  <textarea
                    value={(answers[question.id] as string) || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    required={question.required}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Type your answer here..."
                  />
                )}
              </div>
            ))}

            <div className="flex items-center gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Survey'}
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-700 font-medium">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
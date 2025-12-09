'use client';

import { useState, useEffect } from 'react';
import { getSurvey, updateSurvey } from '@/lib/actions/surveys';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Question, QuestionType } from '@/lib/types';

export default function EditSurveyPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const surveyId = params.id as string;

  useEffect(() => {
    loadSurvey();
  }, []);

  const loadSurvey = async () => {
    const result = await getSurvey(surveyId);
    if (result.error) {
      setError(result.error);
    } else if (result.survey) {
      setTitle(result.survey.title);
      setDescription(result.survey.description);
      setQuestions(result.survey.questions);
    }
    setInitialLoading(false);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: 'single',
      question: '',
      options: [''],
      required: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = [
      ...(updatedQuestions[questionIndex].options || []),
      '',
    ];
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    (updatedQuestions[questionIndex].options || [])[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = (
      updatedQuestions[questionIndex].options || []
    ).filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (questions.length === 0) {
      setError('Please add at least one question');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('questions', JSON.stringify(questions));

    const result = await updateSurvey(surveyId, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      router.push('/admin');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading survey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Survey</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Survey Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., Developer Experience Survey 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Brief description of your survey"
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  + Add Question
                </button>
              </div>

              {questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions yet. Click "Add Question" to start.
                </div>
              )}

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-6 relative">
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700 font-medium"
                    >
                      🗑️ Remove
                    </button>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question {qIndex + 1} *
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Enter your question"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value as QuestionType)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="single">Single Choice</option>
                            <option value="multiple">Multiple Choice</option>
                            <option value="text">Text Answer</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Required</span>
                          </label>
                        </div>
                      </div>

                      {question.type !== 'text' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options
                          </label>
                          <div className="space-y-2">
                            {(question.options || []).map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  required
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder={`Option ${oIndex + 1}`}
                                />
                                {(question.options || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                    className="text-red-600 hover:text-red-700 px-2"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(qIndex)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              + Add Option
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Survey'}
              </button>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
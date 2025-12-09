'use client';

import { deleteSurvey } from '@/lib/actions/surveys';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteSurveyButtonProps {
  surveyId: string;
}

export default function DeleteSurveyButton({ surveyId }: DeleteSurveyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteSurvey(surveyId);
    
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete survey');
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium"
    >
      🗑️ Delete
    </button>
  );
}
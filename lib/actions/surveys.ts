'use server';

import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { Survey, Response, Answer } from '@/lib/types';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

// Get all surveys for users
export async function getSurveys() {
  try {
    const db = await getDatabase();
    const surveysCollection = db.collection<Survey>('surveys');
    
    const surveys = await surveysCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return { surveys: JSON.parse(JSON.stringify(surveys)) };
  } catch (error) {
    console.error('Get surveys error:', error);
    return { error: 'Failed to fetch surveys' };
  }
}

// Get single survey
export async function getSurvey(surveyId: string) {
  try {
    const db = await getDatabase();
    const surveysCollection = db.collection<Survey>('surveys');
    
    const survey = await surveysCollection.findOne({
      _id: new ObjectId(surveyId),
    });
    
    if (!survey) {
      return { error: 'Survey not found' };
    }
    
    return { survey: JSON.parse(JSON.stringify(survey)) };
  } catch (error) {
    console.error('Get survey error:', error);
    return { error: 'Failed to fetch survey' };
  }
}

// Create survey (admin only)
export async function createSurvey(formData: FormData) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const questionsJson = formData.get('questions') as string;

  if (!title || !questionsJson) {
    return { error: 'Title and questions are required' };
  }

  try {
    const questions = JSON.parse(questionsJson);
    const db = await getDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    const newSurvey: Survey = {
      title,
      description: description || '',
      createdBy: new ObjectId(session.userId),
      questions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await surveysCollection.insertOne(newSurvey);
    revalidatePath('/admin');
    revalidatePath('/');
    
    return { 
      success: true, 
      surveyId: result.insertedId.toString() 
    };
  } catch (error) {
    console.error('Create survey error:', error);
    return { error: 'Failed to create survey' };
  }
}

// Update survey (admin only)
export async function updateSurvey(surveyId: string, formData: FormData) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const questionsJson = formData.get('questions') as string;

  if (!title || !questionsJson) {
    return { error: 'Title and questions are required' };
  }

  try {
    const questions = JSON.parse(questionsJson);
    const db = await getDatabase();
    const surveysCollection = db.collection<Survey>('surveys');

    const result = await surveysCollection.updateOne(
      { _id: new ObjectId(surveyId) },
      {
        $set: {
          title,
          description: description || '',
          questions,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return { error: 'Survey not found' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Update survey error:', error);
    return { error: 'Failed to update survey' };
  }
}

// Delete survey (admin only)
export async function deleteSurvey(surveyId: string) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  try {
    const db = await getDatabase();
    const surveysCollection = db.collection<Survey>('surveys');
    const responsesCollection = db.collection<Response>('responses');

    // Delete survey and its responses
    await Promise.all([
      surveysCollection.deleteOne({ _id: new ObjectId(surveyId) }),
      responsesCollection.deleteMany({ surveyId: new ObjectId(surveyId) }),
    ]);

    revalidatePath('/admin');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Delete survey error:', error);
    return { error: 'Failed to delete survey' };
  }
}

// Check if user has already responded to a survey
export async function hasUserResponded(surveyId: string) {
  const session = await getSession();
  
  if (!session) {
    return { hasResponded: false };
  }

  try {
    const db = await getDatabase();
    const responsesCollection = db.collection<Response>('responses');

    const response = await responsesCollection.findOne({
      surveyId: new ObjectId(surveyId),
      userId: new ObjectId(session.userId),
    });

    return { hasResponded: !!response };
  } catch (error) {
    console.error('Check response error:', error);
    return { error: 'Failed to check response status' };
  }
}

// Submit survey response
export async function submitResponse(surveyId: string, answers: Answer[]) {
  const session = await getSession();
  
  if (!session) {
    return { error: 'Please login to submit' };
  }

  try {
    const db = await getDatabase();
    const responsesCollection = db.collection<Response>('responses');

    // Check if user has already responded
    const existingResponse = await responsesCollection.findOne({
      surveyId: new ObjectId(surveyId),
      userId: new ObjectId(session.userId),
    });

    if (existingResponse) {
      return { error: 'You have already submitted a response to this survey' };
    }

    const newResponse: Response = {
      surveyId: new ObjectId(surveyId),
      userId: new ObjectId(session.userId),
      answers,
      submittedAt: new Date(),
    };

    await responsesCollection.insertOne(newResponse);
    revalidatePath('/surveys');
    
    return { success: true };
  } catch (error) {
    console.error('Submit response error:', error);
    return { error: 'Failed to submit response' };
  }
}

// Get survey results (admin only)
export async function getSurveyResults(surveyId: string) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  try {
    const db = await getDatabase();
    const responsesCollection = db.collection<Response>('responses');
    const surveysCollection = db.collection<Survey>('surveys');

    const survey = await surveysCollection.findOne({
      _id: new ObjectId(surveyId),
    });

    if (!survey) {
      return { error: 'Survey not found' };
    }

    const responses = await responsesCollection
      .find({ surveyId: new ObjectId(surveyId) })
      .toArray();

    // Calculate statistics for each question
    const statistics = survey.questions.map((question) => {
      const questionResponses = responses.map((r) => 
        r.answers.find((a) => a.questionId === question.id)
      ).filter(Boolean);

      if (question.type === 'text') {
        return {
          questionId: question.id,
          question: question.question,
          type: question.type,
          responses: questionResponses.map((r) => ({
            answer: r!.answer,
          })),
        };
      }

      // For single and multiple choice questions
      const answerCounts: Record<string, number> = {};
      
      questionResponses.forEach((response) => {
        if (!response) return;
        
        const answers = Array.isArray(response.answer) 
          ? response.answer 
          : [response.answer];
        
        answers.forEach((answer) => {
          answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        });
      });

      return {
        questionId: question.id,
        question: question.question,
        type: question.type,
        totalResponses: questionResponses.length,
        answerCounts,
      };
    });

    return {
      survey: JSON.parse(JSON.stringify(survey)),
      totalResponses: responses.length,
      statistics: JSON.parse(JSON.stringify(statistics)),
    };
  } catch (error) {
    console.error('Get survey results error:', error);
    return { error: 'Failed to fetch survey results' };
  }
}
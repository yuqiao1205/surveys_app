import { ObjectId } from 'mongodb';

export type UserRole = 'user' | 'admin';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export type QuestionType = 'single' | 'multiple' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required: boolean;
}

export interface Survey {
  _id?: ObjectId;
  title: string;
  description: string;
  createdBy: ObjectId;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
}

export interface Response {
  _id?: ObjectId;
  surveyId: ObjectId;
  userId: ObjectId;
  answers: Answer[];
  submittedAt: Date;
}

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
  username: string;
}
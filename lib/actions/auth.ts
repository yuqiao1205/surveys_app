'use server';

import { getDatabase } from '@/lib/mongodb';
import { hashPassword, comparePassword, setSession, clearSession } from '@/lib/auth';
import { User } from '@/lib/types';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as 'user' | 'admin') || 'user';

  if (!username || !email || !password) {
    return { error: 'All fields are required' };
  }

  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Create new user
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      username,
      email,
      passwordHash,
      role,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Create session
    await setSession({
      userId: result.insertedId.toString(),
      email,
      role,
      username,
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register user' };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const db = await getDatabase();
    const usersCollection = db.collection<User>('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Invalid credentials' };
    }

    // Create session
    await setSession({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
      username: user.username,
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to login' };
  }
}

export async function logoutUser() {
  await clearSession();
  redirect('/login');
}
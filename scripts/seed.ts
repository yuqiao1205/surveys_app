import { getDatabase } from '../lib/mongodb';
import { hashPassword } from '../lib/auth';
import { User, Survey, Response } from '../lib/types';
import { ObjectId } from 'mongodb';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const db = await getDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      db.collection('users').deleteMany({}),
      db.collection('surveys').deleteMany({}),
      db.collection('responses').deleteMany({}),
    ]);

    // Create users
    console.log('👥 Creating users...');
    const adminPassword = await hashPassword('admin123');
    const userPassword = await hashPassword('user123');

    const users: User[] = [
      {
        username: 'admin',
        email: 'admin@demo.com',
        passwordHash: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      },
      {
        username: 'john_doe',
        email: 'user@demo.com',
        passwordHash: userPassword,
        role: 'user',
        createdAt: new Date(),
      },
      {
        username: 'jane_smith',
        email: 'jane@demo.com',
        passwordHash: userPassword,
        role: 'user',
        createdAt: new Date(),
      },
      {
        username: 'bob_wilson',
        email: 'bob@demo.com',
        passwordHash: userPassword,
        role: 'user',
        createdAt: new Date(),
      },
    ];

    const userResult = await db.collection<User>('users').insertMany(users);
    const adminId = userResult.insertedIds[0];
    const userId1 = userResult.insertedIds[1];
    const userId2 = userResult.insertedIds[2];
    const userId3 = userResult.insertedIds[3];

    console.log(`✅ Created ${Object.keys(userResult.insertedIds).length} users`);

    // Create surveys
    console.log('📋 Creating surveys...');
    const surveys: Survey[] = [
      {
        title: 'Developer Experience Survey 2024',
        description: 'Help us understand how developers are using AI coding tools in their daily work',
        createdBy: adminId,
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'What is your primary role?',
            options: [
              'Backend dev',
              'Frontend / mobile dev',
              'Full-stack dev',
              'Data / ML engineer',
              'SRE / DevOps / Infra',
              'Engineering manager / tech lead',
              'Other',
            ],
            required: true,
          },
          {
            id: 'q2',
            type: 'single',
            question: 'Years of professional software development experience',
            options: ['<1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'],
            required: true,
          },
          {
            id: 'q3',
            type: 'single',
            question: 'Team type',
            options: [
              'Product feature team',
              'Platform / infra',
              'Data / ML',
              'Internal tools',
              'Other',
            ],
            required: true,
          },
          {
            id: 'q4',
            type: 'single',
            question:
              'How often do you currently use AI coding tools (e.g., Claude Code, GitHub Copilot, ChatGPT) in your development work?',
            options: [
              'Never',
              'Less than once a week',
              '1–2 days per week',
              '3–4 days per week',
              'Daily',
            ],
            required: true,
          },
          {
            id: 'q5',
            type: 'multiple',
            question: 'Which AI coding tools have you used? (Select all that apply)',
            options: [
              'GitHub Copilot',
              'ChatGPT',
              'Claude',
              'Cursor',
              'Tabnine',
              'Amazon CodeWhisperer',
              'Other',
            ],
            required: false,
          },
          {
            id: 'q6',
            type: 'text',
            question: 'What are the biggest challenges you face when using AI coding tools?',
            required: false,
          },
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        title: 'Remote Work Preferences Survey',
        description: 'Share your thoughts on remote and hybrid work arrangements',
        createdBy: adminId,
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'What is your current work arrangement?',
            options: [
              'Fully remote',
              'Hybrid (2-3 days office)',
              'Mostly office',
              'Fully in-office',
            ],
            required: true,
          },
          {
            id: 'q2',
            type: 'single',
            question: 'What is your preferred work arrangement?',
            options: [
              'Fully remote',
              'Hybrid (2-3 days office)',
              'Mostly office',
              'Fully in-office',
            ],
            required: true,
          },
          {
            id: 'q3',
            type: 'multiple',
            question: 'What tools do you use for remote collaboration? (Select all that apply)',
            options: ['Slack', 'Zoom', 'Microsoft Teams', 'Google Meet', 'Discord', 'Other'],
            required: false,
          },
          {
            id: 'q4',
            type: 'text',
            question: 'What do you like most about remote work?',
            required: false,
          },
          {
            id: 'q5',
            type: 'text',
            question: 'What challenges do you face with remote work?',
            required: false,
          },
        ],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        title: 'Programming Languages Survey',
        description: 'Tell us about your programming language preferences and experience',
        createdBy: adminId,
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'What is your primary programming language?',
            options: [
              'JavaScript/TypeScript',
              'Python',
              'Java',
              'C#',
              'Go',
              'Rust',
              'PHP',
              'Ruby',
              'Other',
            ],
            required: true,
          },
          {
            id: 'q2',
            type: 'multiple',
            question: 'Which languages are you proficient in? (Select all that apply)',
            options: [
              'JavaScript/TypeScript',
              'Python',
              'Java',
              'C#',
              'Go',
              'Rust',
              'PHP',
              'Ruby',
              'C/C++',
              'Swift',
              'Kotlin',
            ],
            required: true,
          },
          {
            id: 'q3',
            type: 'single',
            question: 'Which language would you most like to learn next?',
            options: ['Rust', 'Go', 'TypeScript', 'Python', 'Kotlin', 'Swift', 'Other'],
            required: false,
          },
          {
            id: 'q4',
            type: 'text',
            question: 'What do you love most about your primary programming language?',
            required: false,
          },
        ],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
      },
    ];

    const surveyResult = await db.collection<Survey>('surveys').insertMany(surveys);
    const surveyIds = Object.values(surveyResult.insertedIds);

    console.log(`✅ Created ${surveyIds.length} surveys`);

    // Create sample responses
    console.log('📝 Creating sample responses...');
    const responses: Response[] = [
      // Responses for Developer Experience Survey
      {
        surveyId: surveyIds[0],
        userId: userId1,
        answers: [
          { questionId: 'q1', answer: 'Full-stack dev' },
          { questionId: 'q2', answer: '3–5 years' },
          { questionId: 'q3', answer: 'Product feature team' },
          { questionId: 'q4', answer: 'Daily' },
          { questionId: 'q5', answer: ['GitHub Copilot', 'ChatGPT', 'Claude'] },
          {
            questionId: 'q6',
            answer: 'Sometimes the suggestions are not contextually appropriate and need refinement.',
          },
        ],
        submittedAt: new Date('2024-01-16'),
      },
      {
        surveyId: surveyIds[0],
        userId: userId2,
        answers: [
          { questionId: 'q1', answer: 'Backend dev' },
          { questionId: 'q2', answer: '5–10 years' },
          { questionId: 'q3', answer: 'Platform / infra' },
          { questionId: 'q4', answer: '3–4 days per week' },
          { questionId: 'q5', answer: ['GitHub Copilot', 'Cursor'] },
          {
            questionId: 'q6',
            answer: 'Need better understanding of existing codebase before making suggestions.',
          },
        ],
        submittedAt: new Date('2024-01-17'),
      },
      {
        surveyId: surveyIds[0],
        userId: userId3,
        answers: [
          { questionId: 'q1', answer: 'Frontend / mobile dev' },
          { questionId: 'q2', answer: '1–3 years' },
          { questionId: 'q3', answer: 'Product feature team' },
          { questionId: 'q4', answer: '1–2 days per week' },
          { questionId: 'q5', answer: ['ChatGPT', 'Claude'] },
          {
            questionId: 'q6',
            answer: 'Learning curve and integration with existing workflow.',
          },
        ],
        submittedAt: new Date('2024-01-18'),
      },
      // Responses for Remote Work Survey
      {
        surveyId: surveyIds[1],
        userId: userId1,
        answers: [
          { questionId: 'q1', answer: 'Fully remote' },
          { questionId: 'q2', answer: 'Hybrid (2-3 days office)' },
          { questionId: 'q3', answer: ['Slack', 'Zoom', 'Google Meet'] },
          { questionId: 'q4', answer: 'Flexibility and no commute time.' },
          { questionId: 'q5', answer: 'Missing casual conversations with teammates.' },
        ],
        submittedAt: new Date('2024-02-02'),
      },
      {
        surveyId: surveyIds[1],
        userId: userId3,
        answers: [
          { questionId: 'q1', answer: 'Hybrid (2-3 days office)' },
          { questionId: 'q2', answer: 'Hybrid (2-3 days office)' },
          { questionId: 'q3', answer: ['Microsoft Teams', 'Zoom'] },
          { questionId: 'q4', answer: 'Better work-life balance.' },
          { questionId: 'q5', answer: 'Internet connectivity issues sometimes.' },
        ],
        submittedAt: new Date('2024-02-03'),
      },
    ];

    await db.collection<Response>('responses').insertMany(responses);

    console.log(`✅ Created ${responses.length} sample responses`);
    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📌 Demo accounts:');
    console.log('   Admin: admin@demo.com / admin123');
    console.log('   User: user@demo.com / user123');
    console.log('   User: jane@demo.com / user123');
    console.log('   User: bob@demo.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
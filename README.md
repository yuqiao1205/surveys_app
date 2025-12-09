# Survey App - Modern Survey Management System

A full-featured survey management application built with Next.js 14, MongoDB, and TypeScript. Features include user authentication, admin dashboard, survey creation/management, and data visualization.

## Features

### User Features
- 📝 Browse and complete available surveys
- ✅ Single choice, multiple choice, and text answer questions
- 🔒 One response per survey per user
- 📊 Clean, modern UI with Tailwind CSS

### Admin Features
- 🎨 Create and edit surveys with flexible question types
- 📈 View real-time survey results with charts
- 📊 Data visualization using Recharts
- 🗑️ Delete surveys and manage content
- 👥 Full CRUD operations on surveys

### Technical Features
- 🔐 JWT-based authentication
- 🚀 Server Actions (no API routes needed)
- 💾 MongoDB for data persistence
- 🎯 TypeScript for type safety
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd survery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/survey_app
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/survey_app

# JWT Secret (change this to a random secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Session duration
SESSION_DURATION=7d
```

4. Seed the database with mock data:
```bash
npm run seed
```

This will create:
- 4 demo user accounts (1 admin, 3 regular users)
- 3 sample surveys with different question types
- Sample responses for testing

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.



## Project Structure

```
survery/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard pages
│   │   ├── surveys/         # Survey management
│   │   │   ├── create/      # Create survey page
│   │   │   └── [id]/        # Edit and results pages
│   │   └── page.tsx         # Admin dashboard
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── surveys/             # Survey pages
│   │   ├── [id]/           # Individual survey page
│   │   └── success/        # Success page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (survey list)
├── components/             # React components
│   ├── DeleteSurveyButton.tsx
│   ├── Header.tsx
│   └── ResultsChart.tsx
├── lib/                    # Library code
│   ├── actions/           # Server actions
│   │   ├── auth.ts       # Authentication actions
│   │   └── surveys.ts    # Survey CRUD actions
│   ├── auth.ts           # Auth utilities
│   ├── mongodb.ts        # MongoDB connection
│   └── types.ts          # TypeScript types
├── scripts/              # Utility scripts
│   └── seed.ts          # Database seeding script
├── .env.local           # Environment variables (create this)
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies and scripts
```



## Deployment to Vercel

1. Push your code to GitHub

2. Import your repository in Vercel

3. Configure environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `SESSION_DURATION`: `7d` (or your preferred duration)

4. Deploy!

### MongoDB Atlas Setup

For production deployment, use MongoDB Atlas:

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for any IP)
4. Get your connection string
5. Add it to Vercel's environment variables

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with mock data

## Features in Detail

### Authentication
- JWT-based session management
- Secure password hashing with bcryptjs
- Role-based access control (admin/user)
- HTTP-only cookies for security

### Survey Management (Admin)
- Create surveys with flexible question types
- Edit existing surveys
- Delete surveys (with confirmation)
- View detailed results with charts

### Survey Taking (User)
- Browse available surveys
- Complete surveys with various question types
- One response per user per survey
- Visual feedback on completed surveys

### Data Visualization
- Bar charts for multiple choice questions
- Response counts and percentages
- Text response listings
- Real-time statistics

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using Next.js and MongoDB

# ALX Poll App with QR Code Sharing

## Overview

ALX Poll is a web application that allows users to create polls, share them via unique links and QR codes, and collect votes. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- User authentication with Supabase Auth
- Create polls with multiple options
- Public and private polls
- Option for allowing multiple votes per user
- Poll expiration dates
- Share polls via unique links and QR codes
- View poll results in real-time
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Components and Server Actions
- **Database & Auth**: Supabase (PostgreSQL)
- **Deployment**: Vercel (or your preferred hosting)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/alx-poll.git
   cd alx-poll
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**

   - Create a new project in [Supabase](https://supabase.com)
   - Get your project URL and anon key from the API settings
   - Create a `.env.local` file in the project root with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database schema**

   - Install the Supabase CLI if you haven't already:
     ```bash
     npm install -g supabase
     ```

   - Link your project:
     ```bash
     supabase login
     supabase link --project-ref your-project-ref
     ```

   - Push the migrations to your Supabase project:
     ```bash
     supabase db push
     ```

   - (Optional) Seed the database with sample data:
     ```bash
     supabase db reset
     ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Schema

The application uses the following database tables:

### Polls Table

Stores information about polls created by users.

- `id`: UUID (Primary Key)
- `title`: Text (Required)
- `description`: Text (Optional)
- `creator_id`: UUID (Foreign Key to auth.users)
- `is_public`: Boolean (Default: true)
- `allow_multiple_votes`: Boolean (Default: false)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `expires_at`: Timestamp (Optional)

### Poll Options Table

Stores the options for each poll.

- `id`: UUID (Primary Key)
- `poll_id`: UUID (Foreign Key to polls)
- `option_text`: Text (Required)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Votes Table

Tracks votes cast by users.

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users, nullable)
- `option_id`: UUID (Foreign Key to poll_options)
- `created_at`: Timestamp

## Row Level Security (RLS) Policies

The database uses RLS policies to secure data access:

- Public polls are viewable by everyone
- Users can view, update, and delete their own polls
- Only authenticated users can create polls
- Anyone can view options for public polls
- Only poll creators can add options to polls
- Authenticated users can vote on public polls
- Users can delete their own votes

## Helper Functions

The database includes the following helper functions:

- `has_user_voted_on_poll(poll_uuid UUID, user_uuid UUID)`: Checks if a user has already voted on a specific poll
- `get_poll_results(poll_uuid UUID)`: Returns the results of a poll with vote counts for each option

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── actions/            # Server Actions
│   ├── (auth)/             # Authentication routes
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── polls/              # Poll-related routes
│   │   ├── [id]/           # Individual poll view
│   │   ├── create/         # Create poll page
│   │   └── my/             # User's polls page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   └── ui/                 # UI components (shadcn/ui)
├── context/                # React context providers
│   └── AuthContext.tsx     # Authentication context
├── lib/                    # Utility functions
│   ├── polls.ts            # Poll-related utilities
│   └── supabase.ts         # Supabase client
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   └── seed.sql            # Seed data
├── types/                  # TypeScript type definitions
│   └── database.types.ts   # Supabase database types
└── middleware.ts          # Next.js middleware for auth
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

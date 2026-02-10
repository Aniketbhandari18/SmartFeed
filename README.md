# SmartFeed
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Aniketbhandari18/SmartFeed)

SmartFeed is an intelligent feedback management platform designed to help you collect, analyze, and act on user feedback efficiently. By leveraging AI, SmartFeed automatically categorizes feedback, analyzes sentiment, and provides tools to derive actionable insights, helping you make data-driven decisions to improve your products and services.

## ✨ Features

- **Centralized Feedback Collection**: Create dedicated "Spaces" for your products or projects, each with a unique public submission page.
- **AI-Powered Analysis**:
    - **Sentiment Analysis**: Automatically determines if feedback is `positive`, `negative`, or `neutral`.
    - **Smart Categorization**: Classifies feedback into types like `bug_report`, `feature_request`, `praise`, and more.
- **Semantic Similarity Search**: Find related feedback instantly using vector embeddings to identify patterns and recurring themes.
- **AI Feedback Assistant**: Chat with an AI assistant that has contextual knowledge of your feedback data to get summaries, identify trends, and answer questions.
- **Actionable Task Management**: Convert feedback directly into tasks with priority levels and categories. Includes an AI-powered title suggestion feature.
- **Insightful Dashboard**: Get an at-a-glance overview of feedback statistics, including total submissions and sentiment breakdown for each space.
- **Secure Authentication**: User management and authentication powered by Clerk.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Vector Database**: [Qdrant](https://qdrant.tech/)
- **AI / LLM**: [Google Gemini](https://ai.google.dev/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Deployment**: [Vercel](https://vercel.com/)

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v20 or later)
- pnpm, npm, or yarn
- PostgreSQL database
- A Qdrant instance
- Accounts for Clerk and Google AI Studio

### 1. Clone the Repository

```bash
git clone https://github.com/aniketbhandari18/smartfeed.git
cd smartfeed
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file:

```bash
cp .env.example .env
```

Now, fill in the required values:

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Prisma - Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Qdrant - Your Qdrant instance URL and API key
QDRANT_URL="your-qdrant-url-here"
QDRANT_API_KEY="your-qdrant-api-key-here"

# Clerk - Keys from your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key-here"
CLERK_SECRET_KEY="your-clerk-secret-key-here"
CLERK_WEBHOOK_SIGNING_SECRET="your-clerk-webhook-secret-here"

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key-here"
```

### 4. Set Up the Database

Apply the Prisma schema to your PostgreSQL database:

```bash
npx prisma migrate dev
```

### 5. Set Up the Vector Database

Run the script to create the `feedbacks` collection and its payload indexes in your Qdrant instance.

```bash
npx tsx src/scripts/createFeedbackCollection.ts
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
smartfeed/
├── prisma/               # Prisma schema and database migrations
├── public/               # Static assets
└── src/
    ├── actions/          # Next.js Server Actions for data mutation
    ├── app/              # Next.js App Router (pages, layouts, API routes)
    │   ├── api/          # API routes for chat, webhooks, and data fetching
    │   ├── (auth)/       # Clerk authentication pages
    │   ├── dashboard/    # User dashboard
    │   └── spaces/       # Dynamic pages for individual feedback spaces
    ├── components/       # Reusable React components
    │   ├── pages/        # Page-level components
    │   └── ui/           # UI components from shadcn/ui
    ├── hooks/            # Custom React hooks
    ├── lib/              # Core logic, clients, and utility functions
    │   ├── server/       # Server-only helper functions (AI classification, embeddings)
    │   └── zodSchemas/   # Zod validation schemas
    └── scripts/          # Standalone scripts (e.g., Qdrant setup)

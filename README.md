# Language Learning App - Frontend

A modern, interactive language learning platform frontend built with Next.js, featuring real-time voice conversations with AI teachers, adaptive learning, and comprehensive skill development.

## Overview

This frontend application provides an immersive language learning experience where users can practice speaking, listening, reading, and writing skills through direct interaction with AI-powered teachers. The app supports real-time voice communication, progress tracking, and personalized learning paths.

### Key Features

- **Real-Time Voice Conversations**: Live practice sessions with AI language teachers using LiveKit
- **Interactive Learning**: Speaking exercises, pronunciation feedback, and conversational practice
- **User Authentication**: Secure login and profile management with Firebase
- **Progress Tracking**: Comprehensive analytics and learning statistics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Voice Chat Interface**: Seamless audio/video communication components

## Tech Stack

### Frameworks & Libraries
- **[Next.js](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - UI library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript for better development experience

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[LiveKit Components](https://docs.livekit.io/realtime/components/)** - Real-time communication UI components

### Backend Services
- **[LiveKit](https://livekit.io/)** - Real-time voice and video communication
- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service for database and storage
- **[Firebase](https://firebase.google.com/)** - Authentication and user management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## Prerequisites

- Node.js >= 18.x
- npm, yarn, pnpm, or bun package manager
- Backend API running (see backend README)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd language_learning_frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id

# LiveKit Configuration
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server-url

# Firebase Configuration (if used)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Running the Application

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3500](http://localhost:3500) with your browser to see the application.

## Project Structure

```
language_learning_frontend/
├── app/                    # Next.js app router pages
│   ├── login/             # Authentication page
│   ├── onboarding/        # User onboarding
│   ├── profile/           # User profile management
│   ├── voice/             # Voice chat interface
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── MessageHistory.tsx # Chat message display
│   └── VoiceChat.tsx      # Voice chat component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── appwrite.ts        # Appwrite client setup
│   └── firebase.ts        # Firebase client setup
└── public/                # Static assets
```

## Key Components

### VoiceChat Component
Handles real-time voice conversations with AI teachers using LiveKit's React components.

### AuthContext
Manages user authentication state across the application using Firebase Auth.

### MessageHistory
Displays conversation history and provides a chat-like interface for text interactions.

## Development

### Code Style
This project uses ESLint for code linting. Run the linter with:

```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

### Vercel (Recommended)
The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
This app can also be deployed to:
- Netlify
- AWS Amplify
- Docker containers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your license here]

## Support

For questions or issues, please contact [your-email] or open an issue on GitHub.

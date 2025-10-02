'use client';

import VoiceChat from '@/components/VoiceChat';
import Link from 'next/link';

export default function VoiceChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                🎤 AI Language Teacher - Voice Chat
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Practice speaking with your AI language teacher in real-time
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Text Chat
            </Link>
          </div>
        </div>

        {/* Voice Chat Component */}
        <VoiceChat backendUrl="http://localhost:3000" />
      </div>
    </div>
  );
}

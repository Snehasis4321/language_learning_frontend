'use client';

import VoiceChat from '@/components/VoiceChat';
import Link from 'next/link';
import Image from 'next/image';

export default function VoiceChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image src="/logo.png" alt="AI Voice Chat" width={48} height={48} className="object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Voice Chat
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  Practice speaking with your AI language teacher in real-time
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ← Text Chat
            </Link>
          </div>
        </div>

        {/* Voice Chat Component */}
        <VoiceChat backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"} />
      </div>
    </div>
  );
}

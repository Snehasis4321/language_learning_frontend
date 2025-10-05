'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  DisconnectButton,
  useConnectionState,
  useRoomInfo,
  useTranscriptions,
  useLocalParticipant,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import '@livekit/components-styles';

interface VoiceChatProps {
  backendUrl?: string;
}

function VoiceAssistantUI() {
  const { state } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const roomInfo = useRoomInfo();
  const allTranscriptions = useTranscriptions();
  const { localParticipant } = useLocalParticipant();

  // Get local participant's audio track SIDs for comparison
  const localAudioTrackSids = Array.from(localParticipant?.audioTrackPublications?.values() || [])
    .map(pub => pub.trackSid);

  // Ref for auto-scrolling transcripts
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new transcripts arrive
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allTranscriptions]);

  // Debug: Log transcriptions when they change
  useEffect(() => {
    console.log('🔍 Transcriptions updated:', allTranscriptions);
    console.log('🔍 Number of transcriptions:', allTranscriptions.length);
    console.log('🔍 Local participant identity:', localParticipant?.identity);
    console.log('🔍 Local audio track SIDs:', localAudioTrackSids);
  }, [allTranscriptions, localParticipant, localAudioTrackSids]);

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Connection Status */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              connectionState === ConnectionState.Connected
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            }`}>
              <span className="text-white text-xl font-bold">
                {connectionState === ConnectionState.Connected ? '✓' : '⏳'}
              </span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800">
                Connection Status
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {connectionState === ConnectionState.Connected ? (
                  <span>Connected to {roomInfo.name}</span>
                ) : (
                  <span>Connecting...</span>
                )}
              </p>
            </div>
          </div>
          <DisconnectButton className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl md:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base w-full sm:w-auto">
            Disconnect
          </DisconnectButton>
        </div>
      </div>

      {/* Voice Assistant Status */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="flex flex-col items-center space-y-6">
          {/* Status Indicator with Pulse Animation */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
              state === 'listening' ? 'bg-green-500' :
              state === 'thinking' ? 'bg-yellow-500' :
              state === 'speaking' ? 'bg-blue-500' :
              'bg-gray-400'
            }`}></div>
            <div className={`relative p-8 md:p-12 rounded-full shadow-2xl transition-all duration-300 ${
              state === 'listening' ? 'bg-gradient-to-br from-green-500 to-green-600' :
              state === 'thinking' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
              state === 'speaking' ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
              'bg-gradient-to-br from-gray-400 to-gray-500'
            }`}>
              <div className="text-6xl md:text-8xl">
                {state === 'listening' ? '👂' :
                 state === 'thinking' ? '🤔' :
                 state === 'speaking' ? '🗣️' :
                 '💭'}
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 capitalize mb-2">
              {state}
            </h3>
            <p className="text-gray-600 text-base md:text-lg max-w-md">
              {state === 'listening' ? 'I\'m listening to you...' :
               state === 'thinking' ? 'Let me think about that...' :
               state === 'speaking' ? 'Here\'s what I think...' :
               'Start speaking to begin the conversation'}
            </p>
          </div>
        </div>
      </div>

      {/* Transcription Display */}
      {allTranscriptions.length > 0 && (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
            <span className="text-2xl md:text-3xl">📝</span>
            Conversation Transcript
          </h3>
          <div className="space-y-3 md:space-y-4 max-h-96 md:max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
            {allTranscriptions.map((transcription, idx) => {
              // Check if this is user speech by comparing transcribed track ID
              const transcribedTrackId = transcription.streamInfo?.attributes?.['lk.transcribed_track_id'];

              // User speech: transcription of local participant's audio track
              // Agent speech: transcription of agent's audio track
              const isUser = localAudioTrackSids.includes(transcribedTrackId || '');

              return (
                <div
                  key={transcription.streamInfo?.streamId || idx}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 md:p-5 shadow-lg transition-all duration-200 hover:shadow-xl ${
                      isUser
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {isUser ? '👤' : '🤖'}
                      </span>
                      <p className={`text-sm font-bold ${
                        isUser ? 'text-white/90' : 'text-gray-700'
                      }`}>
                        {isUser ? 'You' : 'AI Teacher'}
                      </p>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed">{transcription.text}</p>
                  </div>
                </div>
              );
            })}
            {/* Invisible element at the end for auto-scroll */}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/95 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border-2 border-blue-200">
        <h4 className="font-bold text-blue-700 mb-2 md:mb-3 flex items-center gap-2 text-base md:text-lg">
          <span className="text-xl md:text-2xl">💡</span>
          How to use
        </h4>
        <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Allow microphone access when prompted</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Speak naturally - the AI teacher will respond</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>The assistant will listen, think, and speak back</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>You can interrupt the assistant at any time</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function VoiceChat({ backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000' }: VoiceChatProps) {
  // State for userId - initialized after mount to avoid hydration mismatch
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  const [sessionConfig, setSessionConfig] = useState({
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    topic: '',
    userId: '',
  });

  // Initialize userId after component mounts (client-side only)
  useEffect(() => {
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    setStoredUserId(localStorage.getItem('userId'));
    setSessionConfig(prev => ({ ...prev, userId }));
  }, []);
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    token: string;
    url: string;
    roomName: string;
    sessionId: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const startSession = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/conversation/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'free',
          difficulty: sessionConfig.difficulty,
          topic: sessionConfig.topic || undefined,
          userId: sessionConfig.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.status}`);
      }

      const data = await response.json();
      setConnectionInfo({
        token: data.token,
        url: data.url,
        roomName: data.roomName,
        sessionId: data.sessionId,
      });
      setIsConfigured(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      console.error('Error starting session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!connectionInfo) return;

    try {
      await fetch(`${backendUrl}/api/conversation/${connectionInfo.sessionId}/end`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error ending session:', err);
    }

    setConnectionInfo(null);
    setIsConfigured(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionInfo) {
        fetch(`${backendUrl}/api/conversation/${connectionInfo.sessionId}/end`, {
          method: 'POST',
        }).catch(console.error);
      }
    };
  }, [connectionInfo, backendUrl]);

  if (!isConfigured || !connectionInfo) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="Voice Chat" width={80} height={80} className="object-cover" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Start Voice Conversation
            </h2>
          </div>

          {storedUserId && (
            <div className="mb-6 bg-white border-2 border-blue-200 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg md:text-xl">✨</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-gray-800">
                    <strong className="text-blue-700">Personalized Learning Active!</strong> Your AI teacher will adapt to your preferences and goals.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={sessionConfig.difficulty}
                onChange={(e) =>
                  setSessionConfig((prev) => ({
                    ...prev,
                    difficulty: e.target.value as typeof prev.difficulty,
                  }))
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 text-sm md:text-base"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={sessionConfig.topic}
                onChange={(e) =>
                  setSessionConfig((prev) => ({ ...prev, topic: e.target.value }))
                }
                placeholder="e.g., Travel, Food, Business"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm md:text-base"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl">⚠️</span>
                  <div>
                    <strong className="font-bold text-sm md:text-base">Error</strong>
                    <p className="text-xs md:text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={startSession}
              disabled={isLoading}
              className="w-full px-6 py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl md:rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              {isLoading ? '⏳ Starting...' : '🎤 Start Voice Chat'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <LiveKitRoom
        token={connectionInfo.token}
        serverUrl={connectionInfo.url}
        connect={true}
        audio={true}
        video={false}
        onDisconnected={endSession}
        className="min-h-[600px]"
      >
        <VoiceAssistantUI />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}

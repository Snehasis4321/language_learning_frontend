'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
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
  const { state, audioTrack } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const roomInfo = useRoomInfo();
  const allTranscriptions = useTranscriptions();
  const { localParticipant } = useLocalParticipant();

  // Debug: Log transcriptions when they change
  useEffect(() => {
    console.log('🔍 Transcriptions updated:', allTranscriptions);
    console.log('🔍 Number of transcriptions:', allTranscriptions.length);
  }, [allTranscriptions]);

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              connectionState === ConnectionState.Connected
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            }`}>
              <span className="text-white text-xl font-bold">
                {connectionState === ConnectionState.Connected ? '✓' : '⏳'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Connection Status
              </h3>
              <p className="text-sm text-gray-600">
                {connectionState === ConnectionState.Connected ? (
                  <span>Connected to {roomInfo.name}</span>
                ) : (
                  <span>Connecting...</span>
                )}
              </p>
            </div>
          </div>
          <DisconnectButton className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Disconnect
          </DisconnectButton>
        </div>
      </div>

      {/* Voice Assistant Status */}
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        <div className="text-center space-y-6">
          <div className="inline-block p-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-2xl">
            <div className="text-7xl animate-pulse">
              {state === 'listening' && '👂'}
              {state === 'thinking' && '🤔'}
              {state === 'speaking' && '🗣️'}
              {state === 'idle' && '💭'}
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent capitalize">
              {state}
            </h3>
            <p className="text-gray-600 mt-2 text-lg">
              {state === 'listening' && 'I\'m listening to you...'}
              {state === 'thinking' && 'Let me think about that...'}
              {state === 'speaking' && 'Here\'s what I think...'}
              {state === 'idle' && 'Start speaking to begin the conversation'}
            </p>
          </div>

          {/* Audio Visualizer */}
          {audioTrack && (
            <div className="w-full max-w-md mx-auto h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl overflow-hidden border-2 border-blue-200">
              <BarVisualizer
                state={state}
                barCount={30}
                trackRef={audioTrack}
                className="h-full"
                options={{
                  barWidth: 4,
                  barSpacing: 2,
                  minHeight: 4,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Transcription Display */}
      {allTranscriptions.length > 0 && (
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Conversation Transcript
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {allTranscriptions.map((transcription, idx) => {
              const isUser = transcription.participantInfo?.identity === localParticipant?.identity;
              return (
                <div
                  key={transcription.streamInfo?.streamId || idx}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-1 ${
                      isUser ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {isUser ? 'You' : 'AI Teacher'}
                    </p>
                    <p className="text-sm leading-relaxed">{transcription.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-2 border-blue-200">
        <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2 text-lg">
          <span className="text-2xl">💡</span>
          How to use
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
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
  // Get userId from localStorage if available
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const [sessionConfig, setSessionConfig] = useState({
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    topic: '',
    userId: storedUserId || `user_${Date.now()}`,
  });
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
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="Voice Chat" width={80} height={80} className="object-cover" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Start Voice Conversation
            </h2>
          </div>

          {storedUserId && (
            <div className="mb-6 bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✨</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <strong className="text-blue-700">Personalized Learning Active!</strong> Your AI teacher will adapt to your preferences and goals.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong className="font-bold">Error</strong>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={startSession}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

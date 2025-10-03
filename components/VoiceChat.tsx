'use client';

import { useState, useEffect } from 'react';
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Connection Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {connectionState === ConnectionState.Connected ? (
                <span className="text-green-600 dark:text-green-400">✓ Connected to {roomInfo.name}</span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-400">⏳ Connecting...</span>
              )}
            </p>
          </div>
          <DisconnectButton className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            Disconnect
          </DisconnectButton>
        </div>
      </div>

      {/* Voice Assistant Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center space-y-4">
          <div className="inline-block p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <div className="text-6xl">
              {state === 'listening' && '👂'}
              {state === 'thinking' && '🤔'}
              {state === 'speaking' && '🗣️'}
              {state === 'idle' && '💭'}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
              {state}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {state === 'listening' && 'I\'m listening to you...'}
              {state === 'thinking' && 'Let me think about that...'}
              {state === 'speaking' && 'Here\'s what I think...'}
              {state === 'idle' && 'Start speaking to begin the conversation'}
            </p>
          </div>

          {/* Audio Visualizer */}
          {audioTrack && (
            <div className="w-full max-w-md mx-auto h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            📝 Conversation Transcript
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allTranscriptions.map((transcription, idx) => {
              const isUser = transcription.participantInfo?.identity === localParticipant?.identity;
              return (
                <div
                  key={transcription.streamInfo?.streamId || idx}
                  className={`p-2 mb-2 rounded text-sm ${
                    isUser
                      ? 'bg-blue-100 dark:bg-blue-900 ml-8'
                      : 'bg-gray-100 dark:bg-gray-700 mr-8'
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                    {isUser ? 'You' : 'AI Teacher'}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">{transcription.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 How to use:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Allow microphone access when prompted</li>
          <li>• Speak naturally - the AI teacher will respond</li>
          <li>• The assistant will listen, think, and speak back</li>
          <li>• You can interrupt the assistant at any time</li>
        </ul>
      </div>
    </div>
  );
}

export default function VoiceChat({ backendUrl = 'http://localhost:3000' }: VoiceChatProps) {
  const [sessionConfig, setSessionConfig] = useState({
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    topic: '',
    userId: `user_${Date.now()}`,
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            🎤 Start Voice Conversation
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={sessionConfig.topic}
                onChange={(e) =>
                  setSessionConfig((prev) => ({ ...prev, topic: e.target.value }))
                }
                placeholder="e.g., Travel, Food, Business"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={startSession}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
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

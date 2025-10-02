'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [compactedCount, setCompactedCount] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/conversation/test-cerebras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          difficulty,
          topic: topic || undefined,
          history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation history from backend
      setConversationHistory(data.history || []);

      // Track if conversation was compacted
      if (data.compacted) {
        setCompactedCount((prev) => prev + 1);
        console.log('✨ Conversation compacted to save costs!');
      }

      // Track token usage and costs
      if (data.tokenUsage) {
        setTotalTokens((prev) => prev + data.tokenUsage.totalTokens);
        setTotalCost((prev) => prev + data.tokenUsage.estimatedCost);
        console.log('💰 Token Usage:', data.tokenUsage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setCompactedCount(0);
    setTotalTokens(0);
    setTotalCost(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🎓 AI Language Teacher - Backend Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your Cerebras + LLaMA integration
          </p>
          {messages.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>💬 Messages: {messages.length}</span>
                <span>📝 History: {conversationHistory.length}</span>
                {compactedCount > 0 && (
                  <span className="text-green-600 dark:text-green-400">
                    ✨ Compacted {compactedCount}x
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-sm font-mono">
                <span className="text-blue-600 dark:text-blue-400">
                  🔢 Tokens: {totalTokens.toLocaleString()}
                </span>
                <span className="text-green-600 dark:text-green-400">
                  💰 Cost: ${totalCost.toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Backend URL
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic (Optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Travel, Food, Business"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={clearChat}
            className="mt-3 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Clear Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4 h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p className="text-xl mb-2">👋 Start a conversation!</p>
                <p className="text-sm">Type a message below to test your backend</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {message.role === 'user' ? '👤' : '🤖'}
                      </span>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
              rows={3}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '⏳' : '📤'}
              <span className="ml-2">{isLoading ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

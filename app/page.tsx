"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const difficulty = "beginner";
  const topic = "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [compactedCount, setCompactedCount] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserName(profile.name);
        setUserPreferences(profile.preferences);
      } catch (e) {
        console.error("Error parsing user profile:", e);
      }
    }
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${backendUrl}/api/conversation/test-cerebras`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            difficulty,
            topic: topic || undefined,
            history: conversationHistory,
            userId: userId || undefined,
            userPreferences: userPreferences || undefined,
            userName: userName || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation history from backend
      setConversationHistory(data.history || []);

      // Track if conversation was compacted
      if (data.compacted) {
        setCompactedCount((prev) => prev + 1);
        console.log("✨ Conversation compacted to save costs!");
      }

      // Track token usage and costs
      if (data.tokenUsage) {
        setTotalTokens((prev) => prev + data.tokenUsage.totalTokens);
        setTotalCost((prev) => prev + data.tokenUsage.estimatedCost);
        console.log("💰 Token Usage:", data.tokenUsage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const playAudio = async (text: string, index: number) => {
    try {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }

      setPlayingIndex(index);
      setError(""); // Clear any previous errors

      // Call backend to generate TTS
      const response = await fetch(`${backendUrl}/api/conversation/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      setAudioElement(audio);

      let hasPlayed = false;

      audio.onplay = () => {
        hasPlayed = true;
        setError(""); // Clear error when audio starts playing
      };

      audio.onended = () => {
        setPlayingIndex(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        // Only show error if audio never successfully played
        if (!hasPlayed) {
          console.error("Audio error:", e);
          setPlayingIndex(null);
          setError("Failed to play audio");
          URL.revokeObjectURL(audioUrl);
        }
      };

      await audio.play();
    } catch (err) {
      console.error("Error playing audio:", err);
      setError(err instanceof Error ? err.message : "Failed to play audio");
      setPlayingIndex(null);
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      setAudioElement(null);
    }
    setPlayingIndex(null);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setCompactedCount(0);
    setTotalTokens(0);
    setTotalCost(0);
    setError("");
    stopAudio();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="AI Language Teacher"
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Language Teacher
                </h1>
                {userName && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Welcome back,{" "}
                    <strong className="text-blue-700">{userName}</strong>!
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className={`px-4 md:px-5 py-2.5 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm md:text-base ${
                  userId
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                }`}
              >
                <span>{userId ? "Edit Preferences" : "Create Profile"}</span>
              </Link>
              <Link
                href="/voice"
                className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>Voice Chat</span>
              </Link>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-blue-50 rounded-lg">
                  <span>💬</span>
                  <span className="text-gray-700">
                    <strong>{messages.length}</strong> messages
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-cyan-50 rounded-lg">
                  <span>📝</span>
                  <span className="text-gray-700">
                    <strong>{conversationHistory.length}</strong> in history
                  </span>
                </div>
                {compactedCount > 0 && (
                  <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-green-50 rounded-lg">
                    <span>✨</span>
                    <span className="text-green-700">
                      <strong>Compacted {compactedCount}x</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-blue-50 rounded-lg">
                  <span>🔢</span>
                  <span className="text-gray-700">
                    <strong>{totalTokens.toLocaleString()}</strong> tokens
                  </span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 bg-green-50 rounded-lg">
                  <span>💰</span>
                  <span className="text-green-700">
                    <strong>${totalCost.toFixed(6)}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personalization Notice */}
        {userPreferences && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl p-3 md:p-4 mb-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg md:text-xl">✨</span>
              </div>
              <div className="flex-1">
                <p className="text-xs md:text-sm text-gray-800">
                  <strong className="text-blue-700">
                    Personalized Learning Active!
                  </strong>{" "}
                  Your AI teacher is adapting to your learning style, goals, and
                  preferences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-3 md:p-6 mb-4 h-[400px] sm:h-[500px] md:h-[550px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl md:text-4xl">💬</span>
                </div>
                <p className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                  Start your conversation!
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Type a message below to begin learning
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 md:mt-3">
                      <p
                        className={`text-xs ${
                          message.role === "user"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.role === "assistant" && (
                        <button
                          onClick={() =>
                            playingIndex === index
                              ? stopAudio()
                              : playAudio(message.content, index)
                          }
                          disabled={
                            playingIndex !== null && playingIndex !== index
                          }
                          className="text-xs px-2 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                          title={playingIndex === index ? "Stop" : "Play audio"}
                        >
                          {playingIndex === index ? "⏸️ Stop" : "🔊 Play"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl mb-4 shadow-lg backdrop-blur-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl">⚠️</span>
              <div>
                <strong className="font-bold text-sm md:text-base">Error</strong>
                <p className="text-xs md:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-3 md:p-6">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              disabled={isLoading}
              className="flex-1 px-3 md:px-5 py-3 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50 text-sm md:text-base"
              rows={3}
            />
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl md:rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:h-[56px] text-sm md:text-base"
              >
                <span className="text-lg md:text-xl">{isLoading ? "⏳" : "📤"}</span>
                <span className="hidden sm:inline">{isLoading ? "Sending..." : "Send"}</span>
                <span className="sm:hidden">{isLoading ? "..." : "Send"}</span>
              </button>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl md:rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:h-[56px] text-sm md:text-base"
                  title="Clear all messages"
                >
                  <span className="text-lg md:text-xl">🗑️</span>
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 md:mt-3 gap-1 sm:gap-0">
            <p className="text-xs text-gray-500">
              💡 <strong>Tip:</strong> Press Enter to send, Shift+Enter for new line
            </p>
            <p className="text-xs text-gray-400">
              Powered by Cerebras LLaMA 3.3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

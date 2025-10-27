"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  $id: string;
  session_id: string;
  user_id?: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface MessageHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageHistory({
  isOpen,
  onClose,
}: MessageHistoryProps) {
  const { getIdToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3550";

  const fetchMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getIdToken();
      const response = await fetch(`${backendUrl}/api/conversation/messages`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const groupMessagesBySession = (messages: Message[]) => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      if (!grouped[message.session_id]) {
        grouped[message.session_id] = [];
      }
      grouped[message.session_id].push(message);
    });

    // Sort messages within each session by created_at
    Object.keys(grouped).forEach((sessionId) => {
      grouped[sessionId].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    return grouped;
  };

  if (!isOpen) return null;

  const groupedMessages = groupMessagesBySession(messages);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Chat History</h2>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                Your previous conversations
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-cyan-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="ml-3 text-gray-600">Loading messages...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-600">No messages found</p>
              <p className="text-sm text-gray-500 mt-1">
                Start a conversation to see your chat history
              </p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(
                ([sessionId, sessionMessages]) => (
                  <div
                    key={sessionId}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">💬</span>
                      <h3 className="font-semibold text-gray-800">
                        Conversation {sessionId.replace(/^text_[^_]+_/, "")}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {sessionMessages.length} messages
                      </span>
                    </div>

                    <div className="space-y-3">
                      {sessionMessages.map((message) => (
                        <div
                          key={message.$id}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-2 ${
                                message.role === "user"
                                  ? "text-white/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-8 md:p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total messages: <strong>{messages.length}</strong>
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

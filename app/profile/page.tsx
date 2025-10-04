'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  preferences: {
    targetLanguage: string;
    nativeLanguage: string;
    proficiencyLevel: string;
    learningStyle: string[];
    dailyGoalMinutes: number;
    availableDays: string[];
    preferredTimeOfDay: string[];
    learningGoals: string[];
    motivation: string;
    focusAreas: string[];
    topicsOfInterest: string[];
    preferredVoiceSpeed: string;
    correctionStyle: string;
  };
}

interface UserProgress {
  userId: string;
  totalLearningMinutes: number;
  conversationsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  vocabularyLearned: number;
  lastActiveDate: string;
  weeklyGoalProgress: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/onboarding');
        return;
      }

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const [profileRes, progressRes] = await Promise.all([
          fetch(`${backendUrl}/api/users/profile/${userId}`),
          fetch(`${backendUrl}/api/users/progress/${userId}`),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.user);
        }

        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.progress);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No profile found</p>
          <Link
            href="/onboarding"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="Your Profile" width={48} height={48} className="object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Your Profile
            </h1>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ← Back to Chat
          </Link>
        </div>

        {/* Progress Stats */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {progress.totalLearningMinutes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Learned</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-2">💬</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {progress.conversationsCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversations</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(progress.weeklyGoalProgress)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Goal</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {profile.name}
                </div>
              </div>
              {profile.email && (
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                  <div className="text-lg font-medium text-gray-800 dark:text-white">
                    {profile.email}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Language Learning */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Language Learning
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Target Language</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  🎯 {profile.preferences.targetLanguage}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Native Language</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  🏠 {profile.preferences.nativeLanguage}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Proficiency Level</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  📊 {profile.preferences.proficiencyLevel.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Learning Goals
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.preferences.learningGoals.map((goal) => (
                <span
                  key={goal}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {goal.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
            {profile.preferences.motivation && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Motivation</div>
                <div className="text-gray-800 dark:text-white italic">
                  "{profile.preferences.motivation}"
                </div>
              </div>
            )}
          </div>

          {/* Focus Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Focus Areas
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.preferences.focusAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
            {profile.preferences.topicsOfInterest.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Topics of Interest
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.preferences.topicsOfInterest.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Learning Style */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Learning Style
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.learningStyle.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  {style.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Learning Schedule
            </h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {profile.preferences.dailyGoalMinutes} minutes/day
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Available Days
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.preferences.availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm"
                    >
                      {day.slice(0, 3)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Preferred Time
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.preferences.preferredTimeOfDay.map((time) => (
                    <span
                      key={time}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm"
                    >
                      {time.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Teaching Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Voice Speed</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {profile.preferences.preferredVoiceSpeed.replace(/_/g, ' ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correction Style</div>
                <div className="text-lg font-medium text-gray-800 dark:text-white">
                  {profile.preferences.correctionStyle.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit button */}
        <div className="mt-6 text-center">
          <Link
            href="/onboarding"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ✏️ Edit Preferences
          </Link>
        </div>
      </div>
    </div>
  );
}

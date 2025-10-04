'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserPreferences {
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
}

const LANGUAGES = [
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
  'Japanese', 'Korean', 'Mandarin Chinese', 'Cantonese', 'Arabic',
  'Russian', 'Hindi', 'Bengali', 'Turkish', 'Polish', 'English',
];

const PROFICIENCY_LEVELS = [
  { value: 'absolute_beginner', label: 'Absolute Beginner', desc: 'Starting from scratch' },
  { value: 'beginner', label: 'Beginner', desc: 'Know a few basic phrases' },
  { value: 'elementary', label: 'Elementary', desc: 'Can have simple conversations' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with everyday topics' },
  { value: 'upper_intermediate', label: 'Upper Intermediate', desc: 'Can discuss complex topics' },
  { value: 'advanced', label: 'Advanced', desc: 'Near-native fluency' },
  { value: 'proficient', label: 'Proficient', desc: 'Native or bilingual proficiency' },
];

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual', emoji: '👁️', desc: 'Images, diagrams, charts' },
  { value: 'auditory', label: 'Auditory', emoji: '👂', desc: 'Listening and speaking' },
  { value: 'kinesthetic', label: 'Hands-on', emoji: '✋', desc: 'Practice and doing' },
  { value: 'reading_writing', label: 'Reading/Writing', emoji: '📝', desc: 'Text-based learning' },
  { value: 'conversational', label: 'Conversational', emoji: '💬', desc: 'Through dialogue' },
  { value: 'structured', label: 'Structured', emoji: '📚', desc: 'Organized lessons' },
  { value: 'immersive', label: 'Immersive', emoji: '🌊', desc: 'Full immersion' },
];

const LEARNING_GOALS = [
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'work', label: 'Work/Career', emoji: '💼' },
  { value: 'education', label: 'Education', emoji: '🎓' },
  { value: 'cultural', label: 'Cultural Interest', emoji: '🎭' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'social', label: 'Making Friends', emoji: '🤝' },
  { value: 'relocation', label: 'Relocation', emoji: '🏠' },
  { value: 'hobby', label: 'Personal Hobby', emoji: '🎨' },
  { value: 'test_preparation', label: 'Test Prep', emoji: '📋' },
];

const FOCUS_AREAS = [
  { value: 'speaking', label: 'Speaking', emoji: '🗣️' },
  { value: 'listening', label: 'Listening', emoji: '👂' },
  { value: 'reading', label: 'Reading', emoji: '📖' },
  { value: 'writing', label: 'Writing', emoji: '✍️' },
  { value: 'grammar', label: 'Grammar', emoji: '📐' },
  { value: 'vocabulary', label: 'Vocabulary', emoji: '📚' },
  { value: 'pronunciation', label: 'Pronunciation', emoji: '🔊' },
];

const WEEK_DAYS = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

const TIME_OF_DAY = [
  { value: 'early_morning', label: 'Early Morning', time: '5-9 AM', emoji: '🌅' },
  { value: 'morning', label: 'Morning', time: '9 AM-12 PM', emoji: '☀️' },
  { value: 'afternoon', label: 'Afternoon', time: '12-5 PM', emoji: '🌤️' },
  { value: 'evening', label: 'Evening', time: '5-9 PM', emoji: '🌆' },
  { value: 'night', label: 'Night', time: '9 PM-12 AM', emoji: '🌙' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customTopic, setCustomTopic] = useState('');

  const [preferences, setPreferences] = useState<UserPreferences>({
    targetLanguage: '',
    nativeLanguage: 'English',
    proficiencyLevel: 'beginner',
    learningStyle: [],
    dailyGoalMinutes: 15,
    availableDays: [],
    preferredTimeOfDay: [],
    learningGoals: [],
    motivation: '',
    focusAreas: [],
    topicsOfInterest: [],
    preferredVoiceSpeed: 'normal',
    correctionStyle: 'gentle',
  });

  const totalSteps = 7;

  const toggleArrayValue = (key: keyof UserPreferences, value: string) => {
    const current = preferences[key] as string[];
    setPreferences({
      ...preferences,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  const addCustomTopic = () => {
    if (customTopic.trim()) {
      setPreferences({
        ...preferences,
        topicsOfInterest: [...preferences.topicsOfInterest, customTopic.trim()],
      });
      setCustomTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setPreferences({
      ...preferences,
      topicsOfInterest: preferences.topicsOfInterest.filter((t) => t !== topic),
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, preferences }),
      });

      if (!response.ok) throw new Error('Failed to create profile');

      const data = await response.json();
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userProfile', JSON.stringify(data.user));

      router.push('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return preferences.targetLanguage.length > 0;
      case 3: return preferences.learningStyle.length > 0;
      case 4: return preferences.learningGoals.length > 0;
      case 5: return preferences.focusAreas.length > 0;
      case 6: return preferences.availableDays.length > 0;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Welcome! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Let's personalize your language learning experience
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What's your name?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Which language do you want to learn? 🌍
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Choose your target language and current level
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Language
                  </label>
                  <select
                    value={preferences.targetLanguage}
                    onChange={(e) => setPreferences({ ...preferences, targetLanguage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select a language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Native Language
                  </label>
                  <select
                    value={preferences.nativeLanguage}
                    onChange={(e) => setPreferences({ ...preferences, nativeLanguage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Current Proficiency Level
                  </label>
                  <div className="space-y-2">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setPreferences({ ...preferences, proficiencyLevel: level.value })}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          preferences.proficiencyLevel === level.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium text-gray-800 dark:text-white">{level.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                How do you learn best? 🎯
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Select all that apply (we'll adapt our teaching style)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => toggleArrayValue('learningStyle', style.value)}
                    className={`text-left px-4 py-4 rounded-lg border-2 transition-all ${
                      preferences.learningStyle.includes(style.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.emoji}</span>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">{style.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{style.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Why are you learning? 🎓
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Select your main goals
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {LEARNING_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => toggleArrayValue('learningGoals', goal.value)}
                    className={`px-4 py-4 rounded-lg border-2 transition-all ${
                      preferences.learningGoals.includes(goal.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">{goal.label}</div>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tell us more about your motivation (optional)
                </label>
                <textarea
                  value={preferences.motivation}
                  onChange={(e) => setPreferences({ ...preferences, motivation: e.target.value })}
                  placeholder="Why do you want to learn this language?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                What do you want to focus on? 📚
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Choose your priority areas
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => toggleArrayValue('focusAreas', area.value)}
                    className={`px-4 py-4 rounded-lg border-2 transition-all ${
                      preferences.focusAreas.includes(area.value)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{area.emoji}</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">{area.label}</div>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topics you'd like to practice
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTopic()}
                    placeholder="e.g., Travel, Food, Business..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={addCustomTopic}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.topicsOfInterest.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                    >
                      {topic}
                      <button onClick={() => removeTopic(topic)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                When can you practice? ⏰
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Set your learning schedule
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Daily learning goal
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={preferences.dailyGoalMinutes}
                      onChange={(e) => setPreferences({ ...preferences, dailyGoalMinutes: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[100px]">
                      {preferences.dailyGoalMinutes} min
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Available days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEK_DAYS.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => toggleArrayValue('availableDays', day.value)}
                        className={`px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                          preferences.availableDays.includes(day.value)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Preferred time of day
                  </label>
                  <div className="space-y-2">
                    {TIME_OF_DAY.map((time) => (
                      <button
                        key={time.value}
                        onClick={() => toggleArrayValue('preferredTimeOfDay', time.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          preferences.preferredTimeOfDay.includes(time.value)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{time.emoji}</span>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">{time.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{time.time}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Final preferences ⚙️
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Customize your learning experience
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Voice speed preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'very_slow', label: 'Very Slow', emoji: '🐢' },
                      { value: 'slow', label: 'Slow', emoji: '🚶' },
                      { value: 'normal', label: 'Normal', emoji: '🏃' },
                      { value: 'fast', label: 'Fast', emoji: '⚡' },
                    ].map((speed) => (
                      <button
                        key={speed.value}
                        onClick={() => setPreferences({ ...preferences, preferredVoiceSpeed: speed.value })}
                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                          preferences.preferredVoiceSpeed === speed.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{speed.emoji}</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-white">{speed.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How should we correct your mistakes?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'immediate', label: 'Immediate', desc: 'Correct me right away' },
                      { value: 'gentle', label: 'Gentle hints', desc: 'Guide me without explicit correction' },
                      { value: 'end_of_conversation', label: 'End of session', desc: 'Summary at the end' },
                      { value: 'detailed', label: 'Detailed', desc: 'Explain mistakes thoroughly' },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setPreferences({ ...preferences, correctionStyle: style.value })}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          preferences.correctionStyle === style.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-medium text-gray-800 dark:text-white">{style.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                🎉 Start Learning!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

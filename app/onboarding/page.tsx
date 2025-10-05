"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Japanese",
  "Korean",
  "Mandarin Chinese",
  "Cantonese",
  "Arabic",
  "Russian",
  "Hindi",
  "Bengali",
  "Turkish",
  "Polish",
  "English",
];

const PROFICIENCY_LEVELS = [
  {
    value: "absolute_beginner",
    label: "Absolute Beginner",
    desc: "Starting from scratch",
  },
  { value: "beginner", label: "Beginner", desc: "Know a few basic phrases" },
  {
    value: "elementary",
    label: "Elementary",
    desc: "Can have simple conversations",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "Comfortable with everyday topics",
  },
  {
    value: "upper_intermediate",
    label: "Upper Intermediate",
    desc: "Can discuss complex topics",
  },
  { value: "advanced", label: "Advanced", desc: "Near-native fluency" },
  {
    value: "proficient",
    label: "Proficient",
    desc: "Native or bilingual proficiency",
  },
];

const LEARNING_STYLES = [
  {
    value: "visual",
    label: "Visual",
    emoji: "👁️",
    desc: "Images, diagrams, charts",
  },
  {
    value: "auditory",
    label: "Auditory",
    emoji: "👂",
    desc: "Listening and speaking",
  },
  {
    value: "kinesthetic",
    label: "Hands-on",
    emoji: "✋",
    desc: "Practice and doing",
  },
  {
    value: "reading_writing",
    label: "Reading/Writing",
    emoji: "📝",
    desc: "Text-based learning",
  },
  {
    value: "conversational",
    label: "Conversational",
    emoji: "💬",
    desc: "Through dialogue",
  },
  {
    value: "structured",
    label: "Structured",
    emoji: "📚",
    desc: "Organized lessons",
  },
  {
    value: "immersive",
    label: "Immersive",
    emoji: "🌊",
    desc: "Full immersion",
  },
];

const LEARNING_GOALS = [
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "work", label: "Work/Career", emoji: "💼" },
  { value: "education", label: "Education", emoji: "🎓" },
  { value: "cultural", label: "Cultural Interest", emoji: "🎭" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "social", label: "Making Friends", emoji: "🤝" },
  { value: "relocation", label: "Relocation", emoji: "🏠" },
  { value: "hobby", label: "Personal Hobby", emoji: "🎨" },
  { value: "test_preparation", label: "Test Prep", emoji: "📋" },
];

const FOCUS_AREAS = [
  { value: "speaking", label: "Speaking", emoji: "🗣️" },
  { value: "listening", label: "Listening", emoji: "👂" },
  { value: "reading", label: "Reading", emoji: "📖" },
  { value: "writing", label: "Writing", emoji: "✍️" },
  { value: "grammar", label: "Grammar", emoji: "📐" },
  { value: "vocabulary", label: "Vocabulary", emoji: "📚" },
  { value: "pronunciation", label: "Pronunciation", emoji: "🔊" },
];

const WEEK_DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const TIME_OF_DAY = [
  {
    value: "early_morning",
    label: "Early Morning",
    time: "5-9 AM",
    emoji: "🌅",
  },
  { value: "morning", label: "Morning", time: "9 AM-12 PM", emoji: "☀️" },
  { value: "afternoon", label: "Afternoon", time: "12-5 PM", emoji: "🌤️" },
  { value: "evening", label: "Evening", time: "5-9 PM", emoji: "🌆" },
  { value: "night", label: "Night", time: "9 PM-12 AM", emoji: "🌙" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    targetLanguage: "",
    nativeLanguage: "English",
    proficiencyLevel: "beginner",
    learningStyle: [],
    dailyGoalMinutes: 15,
    availableDays: [],
    preferredTimeOfDay: [],
    learningGoals: [],
    motivation: "",
    focusAreas: [],
    topicsOfInterest: [],
    preferredVoiceSpeed: "normal",
    correctionStyle: "gentle",
  });

  const totalSteps = 7;

  // Load existing preferences from localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    const storedUserId = localStorage.getItem("userId");
    setIsExistingUser(!!storedUserId);
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
        if (profile.preferences) {
          setPreferences({
            targetLanguage: profile.preferences.targetLanguage || "",
            nativeLanguage: profile.preferences.nativeLanguage || "English",
            proficiencyLevel:
              profile.preferences.proficiencyLevel || "beginner",
            learningStyle: profile.preferences.learningStyle || [],
            dailyGoalMinutes: profile.preferences.dailyGoalMinutes || 15,
            availableDays: profile.preferences.availableDays || [],
            preferredTimeOfDay: profile.preferences.preferredTimeOfDay || [],
            learningGoals: profile.preferences.learningGoals || [],
            motivation: profile.preferences.motivation || "",
            focusAreas: profile.preferences.focusAreas || [],
            topicsOfInterest: profile.preferences.topicsOfInterest || [],
            preferredVoiceSpeed:
              profile.preferences.preferredVoiceSpeed || "normal",
            correctionStyle: profile.preferences.correctionStyle || "gentle",
          });
        }
        console.log("✅ Loaded existing preferences for editing");
      } catch (e) {
        console.error("Error loading existing preferences:", e);
      }
    }
  }, []);

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
      setCustomTopic("");
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
      const existingUserId = localStorage.getItem("userId");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3550";

      // If user already exists, update their profile
      if (existingUserId) {
        const response = await fetch(`${backendUrl}/api/users/preferences`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: existingUserId, preferences }),
        });

        if (!response.ok) throw new Error("Failed to update preferences");

        const data = await response.json();

        if (data.isGuest) {
          // Guest user - backend didn't save to DB, just save to localStorage
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              name,
              email,
              preferences,
            })
          );
          console.log("👤 Guest user - preferences saved to localStorage only");
        } else {
          // Authenticated user - backend saved to DB
          localStorage.setItem("userProfile", JSON.stringify(data.user));
          console.log("✅ Updated user preferences in database");
        }
      } else {
        // Create new profile for first-time users
        const response = await fetch(`${backendUrl}/api/users/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, preferences }),
        });

        if (!response.ok) throw new Error("Failed to create profile");

        const data = await response.json();
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userProfile", JSON.stringify(data.user));
        console.log("✅ Created new user profile");
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return preferences.targetLanguage.length > 0;
      case 3:
        return preferences.learningStyle.length > 0;
      case 4:
        return preferences.learningGoals.length > 0;
      case 5:
        return preferences.focusAreas.length > 0;
      case 6:
        return preferences.availableDays.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-3 md:p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto pt-4 md:pt-8 relative z-10">
        {/* Progress bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between text-xs md:text-sm text-white/90 font-medium mb-2 md:mb-3">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-2 md:h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 md:h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12">
          {step === 1 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isExistingUser ? "Edit Your Profile ✏️" : "Welcome! 👋"}
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                {isExistingUser
                  ? "Update your language learning preferences"
                  : "Let's personalize your language learning experience"}
              </p>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What&apos;s your name?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Which language do you want to learn? 🌍
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Choose your target language and current level
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Language
                  </label>
                  <select
                    value={preferences.targetLanguage}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        targetLanguage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select a language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Native Language
                  </label>
                  <select
                    value={preferences.nativeLanguage}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Current Proficiency Level
                  </label>
                  <div className="space-y-3">
                    {PROFICIENCY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            proficiencyLevel: level.value,
                          })
                        }
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.proficiencyLevel === level.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {level.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {level.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                How do you learn best? 🎯
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Select all that apply (we&apos;ll adapt our teaching style)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() =>
                      toggleArrayValue("learningStyle", style.value)
                    }
                    className={`text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                      preferences.learningStyle.includes(style.value)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{style.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {style.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {style.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Why are you learning? 🎓
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Select your main goals
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {LEARNING_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() =>
                      toggleArrayValue("learningGoals", goal.value)
                    }
                    className={`px-5 py-5 rounded-xl border-2 transition-all duration-200 ${
                      preferences.learningGoals.includes(goal.value)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {goal.label}
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell us more about your motivation (optional)
                </label>
                <textarea
                  value={preferences.motivation}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      motivation: e.target.value,
                    })
                  }
                  placeholder="Why do you want to learn this language?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                What do you want to focus on? 📚
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Choose your priority areas
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => toggleArrayValue("focusAreas", area.value)}
                    className={`px-4 py-5 rounded-xl border-2 transition-all duration-200 ${
                      preferences.focusAreas.includes(area.value)
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{area.emoji}</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {area.label}
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Topics you&apos;d like to practice
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomTopic()}
                    placeholder="e.g., Travel, Food, Business..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={addCustomTopic}
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.topicsOfInterest.map((topic) => (
                    <span
                      key={topic}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2 font-medium"
                    >
                      {topic}
                      <button
                        onClick={() => removeTopic(topic)}
                        className="hover:text-red-600 text-lg"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                When can you practice? ⏰
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Set your learning schedule
              </p>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Daily learning goal
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={preferences.dailyGoalMinutes}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          dailyGoalMinutes: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent min-w-[120px]">
                      {preferences.dailyGoalMinutes} min
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Available days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEK_DAYS.map((day) => (
                      <button
                        key={day.value}
                        onClick={() =>
                          toggleArrayValue("availableDays", day.value)
                        }
                        className={`px-3 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-semibold ${
                          preferences.availableDays.includes(day.value)
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                            : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred time of day
                  </label>
                  <div className="space-y-3">
                    {TIME_OF_DAY.map((time) => (
                      <button
                        key={time.value}
                        onClick={() =>
                          toggleArrayValue("preferredTimeOfDay", time.value)
                        }
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.preferredTimeOfDay.includes(time.value)
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{time.emoji}</span>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {time.label}
                            </div>
                            <div className="text-sm text-gray-500">
                              {time.time}
                            </div>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Final preferences ⚙️
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8">
                Customize your learning experience
              </p>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Voice speed preference
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "very_slow", label: "Very Slow", emoji: "🐢" },
                      { value: "slow", label: "Slow", emoji: "🚶" },
                      { value: "normal", label: "Normal", emoji: "🏃" },
                      { value: "fast", label: "Fast", emoji: "⚡" },
                    ].map((speed) => (
                      <button
                        key={speed.value}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            preferredVoiceSpeed: speed.value,
                          })
                        }
                        className={`px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.preferredVoiceSpeed === speed.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-3xl mb-2">{speed.emoji}</div>
                        <div className="text-sm font-semibold text-gray-800">
                          {speed.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    How should we correct your mistakes?
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        value: "immediate",
                        label: "Immediate",
                        desc: "Correct me right away",
                      },
                      {
                        value: "gentle",
                        label: "Gentle hints",
                        desc: "Guide me without explicit correction",
                      },
                      {
                        value: "end_of_conversation",
                        label: "End of session",
                        desc: "Summary at the end",
                      },
                      {
                        value: "detailed",
                        label: "Detailed",
                        desc: "Explain mistakes thoroughly",
                      },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            correctionStyle: style.value,
                          })
                        }
                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                          preferences.correctionStyle === style.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-semibold text-gray-800">
                          {style.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {style.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 md:px-8 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-sm md:text-base"
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
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                {isExistingUser ? "✅ Save Changes" : "🎉 Start Learning!"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

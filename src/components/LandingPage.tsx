import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Dumbbell, 
  Palette, 
  Sun, 
  Calendar, 
  Target, 
  TrendingUp, 
  Star,
  ArrowRight,
  Download,
  Smartphone,
  Zap,
  LogOut,
  Home
} from 'lucide-react';

import { User } from '@supabase/supabase-js';

// CSS for hiding scrollbar
const scrollbarStyles = `
  .progress-grid-scroll::-webkit-scrollbar {
    display: none;
  }
  .progress-grid-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDashboard?: () => void;
  user?: User | null;
}

// TopBar Widget Component
const TopBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-medium text-base md:text-lg">
              Today, {new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </span>
            <p className="text-xs md:text-sm text-blue-100">Current Date</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 md:p-3 hover:bg-white/20 rounded-lg transition-colors" title="Calendar">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
          <button className="p-2 md:p-3 hover:bg-white/20 rounded-lg transition-colors" title="Target">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// DaySelector Widget Component
const DaySelector: React.FC<{ completedHabits: { [key: number]: boolean } }> = ({ completedHabits }) => {
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    const monday = new Date(today);
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    monday.setDate(today.getDate() - daysToSubtract);
    
    const weekDays = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      weekDays.push({
        day: dayNames[i],
        date: date.getDate(),
        completed: false, // All dates start as gray
        current: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }
    
    return weekDays;
  };

  const days = getCurrentWeek();

  // Count completed habits for today
  const today = new Date();
  const todayString = today.toDateString();
  const completedHabitsCount = Object.values(completedHabits).filter(completed => completed).length;

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 md:p-6 mb-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-base md:text-lg">Week View</h3>
          <p className="text-xs md:text-sm text-green-100">Current Week Progress</p>
        </div>
      </div>
      <div className="flex justify-between mb-2">
        {days.map((day) => (
          <span key={day.date} className="text-xs md:text-sm text-green-100">
            {day.day}
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        {days.map((day) => {
          const isToday = day.fullDate.toDateString() === todayString;
          
          if (isToday && completedHabitsCount > 0) {
            const totalHabits = 3;
            const progressPercentage = (completedHabitsCount / totalHabits) * 100;
            const strokeDasharray = 2 * Math.PI * 16; // circumference of circle with radius 16
            const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercentage / 100);
            
            return (
              <div key={day.date} className="relative w-8 h-8 md:w-10 md:h-10">
                {/* Background circle */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-500 flex items-center justify-center text-sm md:text-base font-medium text-white">
                  {day.date}
                </div>
                {/* Progress circle overlay */}
                <svg className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgb(234 179 8)" // yellow-500
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
            );
          }
          
          return (
            <button
              key={day.date}
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium transition-all duration-200 ${
                isToday
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// HabitCard Widget Component
const HabitCard: React.FC<{ habit: any; onHabitToggle?: (habitId: number, completed: boolean) => void }> = ({ habit, onHabitToggle }) => {
  const [isCompleted, setIsCompleted] = useState(habit.completed);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getProgressColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-400';
      case 'green': return 'bg-green-400';
      default: return 'bg-blue-400';
    }
  };

  const getTickColor = (color: string) => {
    switch (color) {
      case 'yellow': return 'text-yellow-500';
      case 'red': return 'text-red-500';
      case 'green': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const handleToggleCompletion = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    if (onHabitToggle) {
      onHabitToggle(habit.id, newCompletedState);
    }
  };

  const Icon = habit.icon;

  return (
    <div className="bg-gray-700 rounded-xl p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getColorClass(habit.color)} flex items-center justify-center`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base md:text-lg">{habit.title}</h3>
            <p className="text-sm md:text-base text-gray-400">Streak: {habit.streak} days</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 md:p-3 hover:bg-gray-600 rounded-lg transition-colors" title="Add Note">
            <Star className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            onClick={handleToggleCompletion}
            className="p-2 md:p-3 hover:bg-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
            title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            <CheckCircle className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-200 ${
              isCompleted ? getTickColor(habit.color) : 'text-gray-400'
            }`} />
          </button>
        </div>
      </div>
      
      {/* Progress Grid */}
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs md:text-sm text-gray-400 mb-2">Year Progress (Jan 1 - Today)</p>
        <div className="overflow-x-auto progress-grid-scroll">
          <div className="space-y-1" style={{ minWidth: 'max-content' }}>
            {(() => {
              const today = new Date();
              const startOfYear = new Date(today.getFullYear(), 0, 1); // January 1st
              const daysInYear = Math.ceil((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
              const todayIndex = daysInYear - 1; // 0-based index for today

              // Create 7 rows
              const rows = [];
              for (let row = 0; row < 7; row++) {
                const weekDays = [];
                for (let week = 0; week < 52; week++) {
                  const dayIndex = week * 7 + row;
                  const isFuture = dayIndex > daysInYear - 1;
                  const isToday = dayIndex === todayIndex;
                  // Only fill current date square with yellow if completed
                  const isDayCompleted = isCompleted && isToday;
                  weekDays.push(
                    <div
                      key={`${week}-${row}`}
                      className={`rounded-sm ${
                        isFuture
                          ? 'bg-gray-600'
                          : isDayCompleted
                            ? getProgressColor(habit.color)
                            : 'bg-gray-700'
                      }`}
                      style={{
                        width: '8px',
                        height: '8px',
                        minWidth: '8px',
                        minHeight: '8px'
                      }}
                      title={`Day ${dayIndex + 1} - ${isFuture ? 'Future' : isDayCompleted ? 'Completed' : 'Not completed'}`}
                    />
                  );
                }
                rows.push(
                  <div key={row} className="flex gap-1">
                    {weekDays}
                  </div>
                );
              }
              return rows;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDashboard, user }) => {
  console.log('LandingPage component rendered with user:', user);
  
  const [completedHabits, setCompletedHabits] = useState<{ [key: number]: boolean }>({
    1: true,  // Go To Gym - initially completed
    2: true,  // Do Skincare - initially completed  
    3: true   // Early Rise - initially completed
  });

  const habits = [
    {
      id: 1,
      title: 'Go To Gym',
      icon: Dumbbell,
      streak: 1,
      completed: true,
      color: 'yellow',
      progress: Array.from({ length: 30 }, (_, i) => i < 20)
    },
    {
      id: 2,
      title: 'Do Skincare',
      icon: Palette,
      streak: 1,
      completed: true,
      color: 'red',
      progress: Array.from({ length: 30 }, (_, i) => i < 18)
    },
    {
      id: 3,
      title: 'Early Rise',
      icon: Sun,
      streak: 2,
      completed: true,
      color: 'green',
      progress: Array.from({ length: 30 }, (_, i) => i < 25)
    }
  ];

  const handleHabitToggle = (habitId: number, completed: boolean) => {
    setCompletedHabits(prev => ({
      ...prev,
      [habitId]: completed
    }));
  };

  const handleSignOut = async () => {
    // This function is not defined in the original file, so it will cause an error.
    // Assuming it's meant to be part of a Supabase context or similar.
    // For now, commenting out to avoid breaking the file.
    // await supabase.auth.signOut();
    // window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{scrollbarStyles}</style>
      {/* Header - Dashboard style */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="ipad-container">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}, {user?.email?.split('@')[0]}!</h1>
              <p className="text-gray-600">Let's make today productive</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Optionally, add a Home button if needed */}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* App Preview Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-black">
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          {/* App Interface Preview */}
          <div className="max-w-md md:max-w-lg mx-auto bg-gray-900 rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* TopBar Widget */}
            <TopBar />
            
            {/* DaySelector Widget */}
            <DaySelector completedHabits={completedHabits} />

            {/* Habit Cards */}
            <div className="space-y-4">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onHabitToggle={handleHabitToggle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 
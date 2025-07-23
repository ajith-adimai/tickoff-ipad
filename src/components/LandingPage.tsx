import React, { useState, useEffect } from 'react';
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
  Home,
  LayoutGrid,
  Plus
} from 'lucide-react';

import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import AddHabitModal from './AddHabitModal';
import HabitCard from './HabitCard';
// Remove all dnd-kit imports and logic

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
const DaySelector: React.FC<{ completions: { [date: string]: Set<number> }, totalHabits: number, selectedDate: Date, onDateChange: (date: Date) => void }> = ({ completions, totalHabits, selectedDate, onDateChange }) => {
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
  const todayString = new Date().toDateString();
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
          const isSelected = day.fullDate.toDateString() === selectedDate.toDateString();
          const dateString = day.fullDate.toDateString();
          const completedHabitsCount = completions[dateString]?.size || 0;
          const progressPercentage = totalHabits > 0 ? (completedHabitsCount / totalHabits) * 100 : 0;
          const strokeDasharray = 2 * Math.PI * 16;
          const strokeDashoffset = strokeDasharray - (strokeDasharray * progressPercentage / 100);
          return (
            <button
              key={day.date}
              className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gray-500 text-white border-2 border-yellow-400'
                  : isToday
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
              onClick={() => {
                if (day.fullDate <= new Date()) onDateChange(day.fullDate);
              }}
              disabled={day.fullDate > new Date()}
              style={{ overflow: 'visible' }}
            >
              {day.date}
              {totalHabits > 0 && progressPercentage > 0 && (
                <svg className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 pointer-events-none" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgb(234 179 8)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                </svg>
              )}
            </button>
          );
        })}
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

const Footer: React.FC<{ onAdd: () => void; onStreaks: () => void }> = ({ onAdd, onStreaks }) => (
  <div className="fixed bottom-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-black border-t border-gray-800 z-50">
    {/* Dashboard/Home */}
    <button className="flex flex-col items-center text-yellow-400 hover:text-yellow-300 transition-colors" title="Dashboard/Home">
      <LayoutGrid className="w-7 h-7" />
    </button>
    {/* Add (+) */}
    <button
      className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black shadow-lg border-4 border-black -mt-10 hover:bg-gray-200 transition-all text-3xl"
      style={{ position: 'relative', top: '-24px' }}
      onClick={onAdd}
      aria-label="Add new event"
    >
      <Plus className="w-8 h-8" />
    </button>
    {/* Streaks/History */}
    <button
      className="flex flex-col items-center text-pink-400 hover:text-pink-300 transition-colors"
      onClick={onStreaks}
      aria-label="View streaks/history"
    >
      <TrendingUp className="w-7 h-7" />
    </button>
  </div>
);

// Remove all dnd-kit imports and logic

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDashboard, user }) => {
  console.log('LandingPage component rendered with user:', user);
  
  const [completions, setCompletions] = useState<{ [date: string]: Set<number> }>({});
  const [habitCompletions, setHabitCompletions] = useState<{ [habitId: number]: string[] }>({});

  const [habits, setHabits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingHabit, setEditingHabit] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    let subscription: any;
    const fetchHabits = async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setHabits(data || []);
    };
    fetchHabits();
    subscription = supabase
      .channel('public:habits')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` }, () => {
        fetchHabits();
      })
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !selectedDate) return;
    const fetchCompletions = async () => {
      const dateString = selectedDate.toDateString();
      const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('date', dateString);
      if (!error) {
        setCompletions(prev => ({ ...prev, [dateString]: new Set((data || []).map((row: any) => row.habit_id)) }));
      }
    };
    fetchCompletions();
  }, [user, selectedDate]);

  // Move fetchCompletionsForYear and its useEffect to the top level, not inside the render
  const fetchCompletionsForYear = async () => {
    if (!user) return;
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
    const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('habit_completions')
      .select('habit_id, date')
      .eq('user_id', user.id)
      .gte('date', startOfYear)
      .lte('date', endOfYear);
    if (!error) {
      const grouped: { [habitId: number]: string[] } = {};
      (data || []).forEach((row: any) => {
        if (!grouped[row.habit_id]) grouped[row.habit_id] = [];
        grouped[row.habit_id].push(row.date);
      });
      setHabitCompletions(grouped);
      setTimeout(() => {
        console.log('Updated completions for all habits:', grouped);
      }, 500);
    }
  };
  useEffect(() => {
    fetchCompletionsForYear();
  }, [user, habits]);

  const handleHabitToggle = (habitId: number, completed: boolean) => {
    setCompletions(prev => {
      const date = new Date().toDateString();
      const set = new Set(prev[date] || []);
      if (completed) set.add(habitId);
      else set.delete(habitId);
      return { ...prev, [date]: set };
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false); // Placeholder for streaks/history modal

  const fetchHabits = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setHabits(data || []);
  };

  // Remove all dnd-kit imports and logic

  return (
    <div className="min-h-screen bg-black text-white relative pb-32">
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
            <DaySelector
              completions={completions}
              totalHabits={habits.length}
              selectedDate={selectedDate}
              onDateChange={(date: Date) => setSelectedDate(date)}
            />

            {/* Habit Cards */}
            {/* Remove all dnd-kit imports and logic */}
            <div className="space-y-4">
              {habits.length === 0 ? (
                <div className="text-center text-gray-400">No habits yet. Add your first habit!</div>
              ) : (
                habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={{ ...habit, completions: habitCompletions[habit.id] || [] }}
                    selectedDate={selectedDate}
                    isCompleted={!!completions[selectedDate.toDateString()]?.has(habit.id)}
                    onUpdate={() => {
                      if (!user) return;
                      fetchHabits();
                      fetchCompletionsForYear();
                    }}
                    onCompletionChange={(habitId: number, completed: boolean) => {
                      setCompletions(prev => {
                        const date = selectedDate.toDateString();
                        const set = new Set(prev[date] || []);
                        if (completed) set.add(habitId);
                        else set.delete(habitId);
                        return { ...prev, [date]: set };
                      });
                      fetchCompletionsForYear();
                    }}
                    onEdit={setEditingHabit}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer onAdd={() => setShowAddModal(true)} onStreaks={() => setShowStreaks(true)} />
      {/* AddHabitModal */}
      {(showAddModal && user && !editingHabit) && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onAdd={fetchHabits}
          user={user}
        />
      )}
      {editingHabit && user && (
        <AddHabitModal
          onClose={() => setEditingHabit(null)}
          onAdd={() => {
            fetchHabits();
            fetchCompletionsForYear();
            setEditingHabit(null);
          }}
          user={user}
          habit={editingHabit}
          editMode={true}
        />
      )}
      {/* Streaks/History Modal Placeholder */}
      {showStreaks && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-black max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setShowStreaks(false)}>
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Streaks & History</h2>
            <p>Coming soon: View all your past streaks and completed events here!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 